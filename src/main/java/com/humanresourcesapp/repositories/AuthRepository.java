package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.Auth;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthRepository extends JpaRepository<Auth, Long>
{
}
