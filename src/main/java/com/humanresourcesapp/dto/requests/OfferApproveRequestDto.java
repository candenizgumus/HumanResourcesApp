package com.humanresourcesapp.dto.requests;

import com.humanresourcesapp.entities.enums.ESubscriptionType;

public record OfferApproveRequestDto(Long offerId , ESubscriptionType ESubscriptionType)
{
}
