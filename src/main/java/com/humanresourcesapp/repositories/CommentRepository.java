package com.humanresourcesapp.repositories;

import com.humanresourcesapp.dto.responses.CommentResponseDto;
import com.humanresourcesapp.entities.Comment;
import com.humanresourcesapp.entities.enums.EStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment,Long> {

    List<Comment> findAllByCompanyId(Long companyId);

    Optional<Comment> findByCompanyId(Long companyId);

    List<Comment> findAllByLongDescriptionIsNotNullAndShortDescriptionIsNotNull();
}
