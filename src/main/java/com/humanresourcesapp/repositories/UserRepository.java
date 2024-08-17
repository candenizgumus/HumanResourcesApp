package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.Company;
import com.humanresourcesapp.entities.User;
import com.humanresourcesapp.entities.enums.EStatus;
import com.humanresourcesapp.entities.enums.EUserType;
import com.humanresourcesapp.views.VwGetAllOffer;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long>
{
    Optional<User> findByPhone(String phone);

    Optional<User> findByEmail(String email);

    List<User> findAllByCompanyId(Long companyId);

    Optional<User> findByAuthId(Long authId);

    Optional<User> findByEmailAndPhone(String email, String phone);


    @Query("select u from User u  where  u.email like %?1% ORDER BY u.id ASC")
    List<User> getAllUserByEmailSearch(String email ,PageRequest pageRequest);

    @Query("select u from User u  where  u.email like %?1%  AND u.userType = 'EMPLOYEE' AND u.companyId = ?2")
    List<User> findAllUsersByEmailAndCompanyId(String email ,Long companyId ,PageRequest pageRequest);

    @Query("select Count(u) from User u  where  u.email like %?1%")
    Long getAllUserByEmailSearchCount(String email);

    @Query("select Count(u) from User u  where  u.createdAt BETWEEN ?1 and ?2 AND u.userType = 'MANAGER'")
    Long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);


    List<User> findAllByCompanyIdAndStatusAndUserType(Long companyId, EStatus status,EUserType userType);

    Long countAllByUserType(EUserType userType);
    Long countAllByUserTypeAndStatus(EUserType userType, EStatus status);

    @Query("SELECT u FROM User u WHERE u.userType = :userType AND " +
            "MONTH(u.birthDate) = MONTH(CURRENT_DATE) OR " +
            "MONTH(u.birthDate) = MONTH(CURRENT_DATE) + 1")
    List<User> findEmployeesWithUpcomingBirthdays(@Param("userType") EUserType userType);

    @Query("SELECT DISTINCT u.companyId FROM User u WHERE u.subscriptionEndDate BETWEEN :now AND :endRange")
    List<Long> findDistinctCompanyIdsWithSubscriptionEndingSoon(@Param("now") LocalDate now, @Param("endRange") LocalDate endRange);

    @Query("SELECT u FROM User u WHERE u.companyId = :companyId ORDER BY u.createdAt ASC")
    Optional<User> findFirstUserByCompanyId(@Param("companyId") Long companyId);
}
