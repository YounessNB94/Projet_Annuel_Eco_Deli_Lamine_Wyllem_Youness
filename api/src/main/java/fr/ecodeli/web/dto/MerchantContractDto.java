package fr.ecodeli.web.dto;

import fr.ecodeli.entity.MerchantContractStatus;
import java.time.LocalDate;
import java.time.OffsetDateTime;

public record MerchantContractDto(
        Long id,
        Long merchantCompanyId,
        MerchantContractStatus status,
        LocalDate startDate,
        LocalDate endDate,
        Long termsPdfDocumentId,
        OffsetDateTime createdAt,
        OffsetDateTime signedAt,
        Long signedByUserId,
        OffsetDateTime countersignedAt,
        Long countersignedByAdminId
) {
}

