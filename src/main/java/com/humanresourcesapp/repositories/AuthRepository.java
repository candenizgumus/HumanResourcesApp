package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.Auth;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.entities.enums.EStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AuthRepository extends JpaRepository<Auth, Long>
{

    Optional<Auth> findByEmail(String email);

    Optional<Auth> findByEmailAndPassword(String email,String password);


    List<Auth> findAllByIdIn(List<Long> authIdList);
}
