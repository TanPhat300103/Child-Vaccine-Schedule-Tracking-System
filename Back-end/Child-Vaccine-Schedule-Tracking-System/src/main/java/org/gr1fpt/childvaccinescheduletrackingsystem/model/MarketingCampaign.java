package org.gr1fpt.childvaccinescheduletrackingsystem.model;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Pattern;
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
    @Pattern(regexp = "^[A-Za-z0-9]{6,10}$", message = "Wrong format coupon")
    private String coupon;
    private int discount;
    private String description;
    private boolean active;


}
