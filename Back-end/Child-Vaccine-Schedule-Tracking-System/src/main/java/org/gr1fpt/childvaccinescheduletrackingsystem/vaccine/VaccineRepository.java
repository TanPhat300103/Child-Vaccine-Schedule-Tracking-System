package org.gr1fpt.childvaccinescheduletrackingsystem.vaccine;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VaccineRepository extends JpaRepository<Vaccine,String> {
    List<Vaccine> findByCountry(String country);
    List<Vaccine> findByPriceBetween(int minPrice, int maxPrice);
    List<Vaccine> findByNameContaining(String name);
    long countByActive(boolean active);
}
