package org.gr1fpt.childvaccinescheduletrackingsystem.service;

import org.gr1fpt.childvaccinescheduletrackingsystem.exception.CustomException;
import org.gr1fpt.childvaccinescheduletrackingsystem.model.MarketingCampaign;
import org.gr1fpt.childvaccinescheduletrackingsystem.repository.MarketingCampaignRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MarketingCampaignService {
    @Autowired
    private MarketingCampaignRepository marketingCampaignRepository;

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

}
