package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long>
{
    Optional<User> findByPhone(String phone);

    Optional<User> findByEmail(String email);

    List<User> findAllByCompanyId(Long companyId);

    Optional<User> findByAuthId(Long authId);

    Optional<User> findByEmailAndPhone(String email, String phone);
}
