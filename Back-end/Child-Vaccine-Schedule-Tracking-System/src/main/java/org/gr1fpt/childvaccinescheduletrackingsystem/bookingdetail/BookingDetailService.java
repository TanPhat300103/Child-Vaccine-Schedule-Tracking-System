package org.gr1fpt.childvaccinescheduletrackingsystem.bookingdetail;

import org.gr1fpt.childvaccinescheduletrackingsystem.booking.Booking;
import org.gr1fpt.childvaccinescheduletrackingsystem.booking.BookingDTO;
import org.gr1fpt.childvaccinescheduletrackingsystem.booking.BookingRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.child.Child;
import org.gr1fpt.childvaccinescheduletrackingsystem.combodetail.ComboDetail;
import org.gr1fpt.childvaccinescheduletrackingsystem.vaccine.VaccineRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.combodetail.ComboDetailService;
import org.gr1fpt.childvaccinescheduletrackingsystem.medicalhistory.MedicalHistoryService;
import org.gr1fpt.childvaccinescheduletrackingsystem.vaccinecombo.VaccineComboService;
import org.gr1fpt.childvaccinescheduletrackingsystem.vaccinedetail.VaccineDetailService;
import org.gr1fpt.childvaccinescheduletrackingsystem.vaccine.Vaccine;
import org.gr1fpt.childvaccinescheduletrackingsystem.vaccinecombo.VaccineCombo;
import org.gr1fpt.childvaccinescheduletrackingsystem.vaccinedetail.VaccineDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class BookingDetailService {
    @Autowired
    BookingDetailRepository bookingDetailRepository;
    @Autowired
    VaccineRepository vaccineRepository;
    @Autowired
    ComboDetailService comboDetailService;
    @Autowired
    VaccineDetailService vaccineDetailService;
    @Autowired
    VaccineComboService vaccineComboService;
    @Autowired
    MedicalHistoryService medicalHistoryService;
    @Autowired
    private BookingRepository bookingRepository;

    public java.util.List<BookingDetail> getAll() {
        return bookingDetailRepository.findAll();
    }

    @Transactional
    public void create(BookingDTO bookingDTO) {

        Booking booking = bookingDTO.getBooking();
        List<String> listVaccineId = bookingDTO.getVaccineId();
        Child child = bookingDTO.getChild();
        List<String> listVaccineComboId = bookingDTO.getVaccineComboId();
        //Thêm map để lưu vacccine thuộc combo nào
        Map<String, String> vaccineComboMap = new HashMap<>();

        //Xử lý tách các Vaccine trong combo thành vaccine lẻ để tạo bookingdetail
        if (listVaccineComboId != null) {
            for (String vaccineComboId : listVaccineComboId) {
                List<ComboDetail> idVaccineInCombo = comboDetailService.findByVaccineComboId(vaccineComboId);
                for (ComboDetail comboDetail : idVaccineInCombo) {
                    String vaccineId = comboDetail.getVaccine().getVaccineId();
                    listVaccineId.add(vaccineId);
                    // Thêm mapping vaccine - combo vào Map
                    vaccineComboMap.put(vaccineId, vaccineComboId);
                }
            }
        }

        // Khởi tạo Detail Booking từ listvaccine
        for (String vaccineId : listVaccineId) {
            Vaccine vaccine = vaccineRepository.findById(vaccineId).orElseThrow(() -> new RuntimeException("Vaccine not found"));
            int dose = vaccine.getDoseNumber();
            int flag = 0;
            // Xử lý ngày tiêm giữa các vaccine có nhiều dose
            for (int i = 1; i <= dose; i++) {
                java.sql.Date scheduleDate = booking.getBookingDate();
                if (dose > 1) {
                    VaccineDetail vaccineDetail = vaccineDetailService.searchByVaccineParent(vaccineId).getFirst();
                    if (flag >= 1) {
                        int day = vaccineDetail.getDay() * flag;
                        scheduleDate = java.sql.Date.valueOf(scheduleDate.toLocalDate().plusDays(day));
                    }
                    flag++;
                }
                // Tạo booking detail với VaccineCombo nếu vaccine thuộc combo
                String comboId = vaccineComboMap.get(vaccineId);
                VaccineCombo vaccineCombo = null;
                if (comboId != null) {
                    vaccineCombo = vaccineComboService.findById(comboId)
                            .orElse(null);
                }

                //BookingID sẽ được tạo ở đây
                BookingDetail bookingDetail = new BookingDetail(UUID.randomUUID().toString(), booking, child, scheduleDate, null, vaccine, "none", vaccineCombo, 1);
                bookingDetailRepository.save(bookingDetail);
            }
        }
    }

    public void deleteByBookingId(String id) {
        bookingDetailRepository.deleteByBooking_BookingId(id);
    }

    public BookingDetail updateStatus(String id, int status) {
        BookingDetail bookingDetail = bookingDetailRepository.findById(id).orElseThrow();
        bookingDetail.setStatus(status);
        return bookingDetailRepository.save(bookingDetail);
    }

    public List<BookingDetail> findByBooking(String id) {
        return bookingDetailRepository.findByBooking_BookingId(id);
    }

    public BookingDetail confirmAdministeredDate(String id) {
        BookingDetail bookingDetail = bookingDetailRepository.findById(id).orElseThrow();
        bookingDetail.setAdministeredDate(Date.valueOf(LocalDateTime.now().toLocalDate()));
        //Mỗi khi staff xác nhận là đã tiêm, sẽ pick ngày hnay làm ngày tiêm + -1 vaccine trong kho
        //Đồng thời tạo 1 medicalhistory
        vaccineDetailService.useNearestVaccineDetail(bookingDetail.getVaccine().getVaccineId());
        createMedicalHistory(bookingDetail.getBooking().getBookingId(), bookingDetail.getVaccine().getVaccineId(),bookingDetail);
        return bookingDetailRepository.save(bookingDetail);
    }

    public BookingDetail updateReaction(String id, String reaction) {
        BookingDetail bookingDetail = bookingDetailRepository.findById(id).orElseThrow();
        bookingDetail.setReactionNote(reaction);
        return bookingDetailRepository.save(bookingDetail);
    }

    public void createMedicalHistory(String bookingid, String vaccineid,BookingDetail bookingDetail) {
        int dosecount = bookingDetailRepository.countByBookingIdAndVaccineIdAndAdministeredDateNotNull(bookingid, vaccineid);
        medicalHistoryService.create(bookingDetail,dosecount);
    }

    public void canceledBookingDetail(String bookingId){
        List<BookingDetail> bookingDetail = bookingDetailRepository.findByBooking_BookingId(bookingId);
        for(BookingDetail detail : bookingDetail){
            if(detail.getStatus()==1) {
                detail.setStatus(3);
                bookingDetailRepository.save(detail);
            }
        }
    }
}
