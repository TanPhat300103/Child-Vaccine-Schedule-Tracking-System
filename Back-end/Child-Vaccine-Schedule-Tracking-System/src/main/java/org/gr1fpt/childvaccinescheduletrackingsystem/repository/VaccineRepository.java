package org.gr1fpt.childvaccinescheduletrackingsystem.repository;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.gr1fpt.childvaccinescheduletrackingsystem.model.Vaccine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VaccineRepository extends JpaRepository<Vaccine,String> {
    List<Vaccine> findByCountry(String country);
    List<Vaccine> findByPriceBetween(int minPrice, int maxPrice);

}
