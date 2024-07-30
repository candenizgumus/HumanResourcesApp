package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.Offer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OfferRepository extends JpaRepository<Offer, Long>
{
}
