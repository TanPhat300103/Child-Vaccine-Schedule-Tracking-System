package org.gr1fpt.childvaccinescheduletrackingsystem.domain.marketingcampaign;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Entity
@Table(name = "MarketingCampaign")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class MarketingCampaign {
    @Id
    private String MarketingCampaignId;
    private String name;
    private Date startTime;
    private Date endTime;
    @Column(unique = true)
    private String coupon;
    private int discount;
    private String description;
    private boolean active;


}
