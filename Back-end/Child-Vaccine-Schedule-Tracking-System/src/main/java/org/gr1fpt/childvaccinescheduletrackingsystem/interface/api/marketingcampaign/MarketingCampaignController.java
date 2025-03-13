package org.gr1fpt.childvaccinescheduletrackingsystem.marketingcampaign;


import org.gr1fpt.childvaccinescheduletrackingsystem.application.marketingcampaign.MarketingCampaignService;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.marketingcampaign.MarketingCampaign;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("marketing")
public class MarketingCampaignController {
    @Autowired
    private MarketingCampaignService marketingCampaignService;

    @GetMapping()
    public List<MarketingCampaign> getAllCampaigns() {
        return marketingCampaignService.getAll();
    }

    @PostMapping("create")
    public MarketingCampaign createMarketingCampaign(@RequestBody MarketingCampaign marketingCampaign) {
        return marketingCampaignService.add(marketingCampaign);
    }


    @GetMapping("findid")
    public Optional<MarketingCampaign> getById(@RequestParam String id) {
        return marketingCampaignService.findById(id);
    }

    @PostMapping("active")
    public void setActive(@RequestParam String id) {
        marketingCampaignService.setActive(id);
    }

    @PostMapping("update")
    public MarketingCampaign updateMarketingCampaign(@RequestBody MarketingCampaign marketingCampaign) {
        return marketingCampaignService.update(marketingCampaign);
    }

    @GetMapping("findbycoupon")
    public MarketingCampaign findByCoupon(@RequestParam String coupon) {
        return marketingCampaignService.findByCoupon(coupon);
    }


}
