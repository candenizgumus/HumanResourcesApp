package com.humanresourcesapp.dto.requests;

public record CommentUpdateRequestDto(String shortDescription, String longDescription, Boolean setNewManager) {
}
