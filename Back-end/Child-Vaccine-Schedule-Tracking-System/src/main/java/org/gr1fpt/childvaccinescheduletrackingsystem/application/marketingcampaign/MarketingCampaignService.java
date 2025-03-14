package org.gr1fpt.childvaccinescheduletrackingsystem.application.marketingcampaign;

import org.gr1fpt.childvaccinescheduletrackingsystem.domain.marketingcampaign.MarketingCampaign;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.notification.Notification;
import org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.marketingcampaign.MarketingCampaignRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.application.notification.NotificationService;
import org.gr1fpt.childvaccinescheduletrackingsystem.interfaces.exception.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MarketingCampaignService {
    @Autowired
    private MarketingCampaignRepository marketingCampaignRepository;

    @Autowired
    private NotificationService notificationService;

    public List<MarketingCampaign> getAll() {
        return marketingCampaignRepository.findAll();
    }

    public String generateId(){
        long count = marketingCampaignRepository.count();
        return "MC" + String.format("%05d", count+1);
    }

    public MarketingCampaign add(MarketingCampaign marketingCampaign) {
        marketingCampaign.setMarketingCampaignId(generateId());
        marketingCampaign.setActive(true);
        //moi khi marketing moi duoc tao ra thi thong bao cho customer
        Notification notification = new Notification();
        notification.setMessage("New campaign: " + marketingCampaign.getCoupon() + " discount up to " + marketingCampaign.getDiscount()+"%");
        notificationService.createNotificationCustomer(notification);
        return marketingCampaignRepository.save(marketingCampaign);
    }

    public Optional<MarketingCampaign> findById(String id) {
        return marketingCampaignRepository.findById(id);
    }

    public void setActive(String id) {
        if(marketingCampaignRepository.existsById(id)){
            MarketingCampaign marketingCampaign = marketingCampaignRepository.findById(id).orElseThrow();
            if(marketingCampaign.isActive()){
                marketingCampaign.setActive(false);
            }
            else{
                marketingCampaign.setActive(true);
            }
            marketingCampaignRepository.save(marketingCampaign);
        }
        else throw new CustomException("Campain is not found", HttpStatus.NOT_FOUND);
    }

    public MarketingCampaign update(MarketingCampaign marketingCampaign) {
        if(marketingCampaignRepository.existsById(marketingCampaign.getMarketingCampaignId())){
            return marketingCampaignRepository.save(marketingCampaign);
        }
        else throw new CustomException("Campain is not found", HttpStatus.NOT_FOUND);
    }

    public MarketingCampaign findByCoupon(String coupon){
        MarketingCampaign marketingCampaign = marketingCampaignRepository.findByCoupon(coupon);
        if(marketingCampaign == null){
            throw new CustomException("Campain is not found", HttpStatus.NOT_FOUND);
        }
        return marketingCampaign;
    }

}
