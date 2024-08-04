package com.humanresourcesapp.dto.responses;

import lombok.Builder;

@Builder
public record CommentResponseDto(Long id,String managerName, String companyName, String title, String commentText, String photo) {
}
