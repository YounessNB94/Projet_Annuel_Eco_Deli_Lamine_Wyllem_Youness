package fr.ecodeli.mapper;

import fr.ecodeli.entity.Announcement;
import fr.ecodeli.entity.Delivery;
import fr.ecodeli.entity.Invoice;
import fr.ecodeli.entity.Payment;
import fr.ecodeli.web.dto.admin.AnnouncementAdminDto;
import fr.ecodeli.web.dto.admin.DeliveryAdminDto;
import fr.ecodeli.web.dto.admin.InvoiceAdminDto;
import fr.ecodeli.web.dto.admin.PaymentAdminDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = MappingConstants.ComponentModel.JAKARTA_CDI,
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AdminDashboardMapper {

    @Mapping(target = "merchantCompanyId", source = "merchantCompany.id")
    @Mapping(target = "createdByUserId", source = "createdBy.id")
    AnnouncementAdminDto toDto(Announcement announcement);

    @Mapping(target = "courierUserId", source = "courier.id")
    @Mapping(target = "shipperUserId", source = "shipper.id")
    @Mapping(target = "announcementId", source = "announcement.id")
    DeliveryAdminDto toDto(Delivery delivery);

    @Mapping(target = "payerUserId", source = "payer.id")
    PaymentAdminDto toDto(Payment payment);

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "paymentId", source = "payment.id")
    InvoiceAdminDto toDto(Invoice invoice);
}

