package com.humanresourcesapp.dto.requests;

public record AddSubscriptionTimeRequestDto(
        String subscriptionType,
        Long managerId
)
{
}
