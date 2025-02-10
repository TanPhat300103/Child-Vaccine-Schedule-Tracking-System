package org.gr1fpt.childvaccinescheduletrackingsystem.controller;


import jakarta.validation.Valid;
import org.gr1fpt.childvaccinescheduletrackingsystem.exception.CustomException;
import org.gr1fpt.childvaccinescheduletrackingsystem.model.MarketingCampaign;
import org.gr1fpt.childvaccinescheduletrackingsystem.repository.MarketingCampaignRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.service.MarketingCampaignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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

}
