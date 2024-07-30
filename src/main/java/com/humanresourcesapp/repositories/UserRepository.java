package com.humanresourcesapp.repositories;

import com.humanresourcesapp.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,Long>
{

}
