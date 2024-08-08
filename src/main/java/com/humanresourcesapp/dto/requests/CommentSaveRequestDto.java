package com.humanresourcesapp.dto.requests;

public record CommentSaveRequestDto(Long managerId, Long companyId, String shortDescription, String longDescription, String photo) {
}
