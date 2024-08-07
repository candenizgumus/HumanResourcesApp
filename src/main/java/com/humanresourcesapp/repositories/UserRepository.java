package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.views.VwGetAllOffer;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long>
{
    Optional<User> findByPhone(String phone);

    Optional<User> findByEmail(String email);

    List<User> findAllByCompanyId(Long companyId);

    Optional<User> findByAuthId(Long authId);

    Optional<User> findByEmailAndPhone(String email, String phone);


    @Query("select u from User u  where  u.email like %?1%")
    List<User> getAllUserByEmailSearch(String email ,PageRequest pageRequest);

    @Query("select u from User u  where  u.email like %?1%  AND u.userType = 'EMPLOYEE' AND u.managerId = ?2")
    List<User> findAllUsersByEmailAndManagerId(String email ,Long managerId ,PageRequest pageRequest);

    @Query("select Count(u) from User u  where  u.email like %?1%")
    Long getAllUserByEmailSearchCount(String email);
}
