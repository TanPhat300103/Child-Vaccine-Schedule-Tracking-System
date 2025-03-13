package org.gr1fpt.childvaccinescheduletrackingsystem.domain.payment;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.booking.Booking;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.marketingcampaign.MarketingCampaign;

import java.sql.Date;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "Payment")
public class Payment {
    @Id
    private String paymentId;

    @OneToOne
    @JoinColumn(name = "bookingId", nullable = false)
    private Booking booking;

    private Date date = null;
    @Min(value = 0,message = "total must be greater than 0")
    private int total;

    private boolean method;
    private boolean status;
    private String transactionId;

    @ManyToOne
    @JoinColumn(name = "MarketingCampaignId",nullable = true)
    private MarketingCampaign marketingCampaign;

    @PrePersist
    public void generateTransactionId() {
        if (this.transactionId == null) {
            this.transactionId = UUID.randomUUID().toString();
        }
    }
}
