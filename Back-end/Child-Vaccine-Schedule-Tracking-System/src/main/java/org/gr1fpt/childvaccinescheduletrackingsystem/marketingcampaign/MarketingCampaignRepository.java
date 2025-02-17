package org.gr1fpt.childvaccinescheduletrackingsystem.marketingcampaign;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MarketingCampaignRepository extends JpaRepository<MarketingCampaign, String> {
    public MarketingCampaign findByCoupon(String couponCode);
}
