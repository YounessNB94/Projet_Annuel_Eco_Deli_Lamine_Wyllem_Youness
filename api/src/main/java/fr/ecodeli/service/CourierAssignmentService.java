package fr.ecodeli.service;

import fr.ecodeli.entity.Announcement;
import fr.ecodeli.entity.AnnouncementAssignment;
import fr.ecodeli.entity.AnnouncementAssignmentId;
import fr.ecodeli.entity.AppUser;
import fr.ecodeli.repository.AnnouncementAssignmentRepository;
import fr.ecodeli.web.exception.EcodeliException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;
import java.time.OffsetDateTime;
import java.util.List;

@ApplicationScoped
public class CourierAssignmentService {

    private final AnnouncementAssignmentRepository repository;
    private final CourierProfileService courierProfileService;
    private final DeliveryService deliveryService;

    @Inject
    public CourierAssignmentService(AnnouncementAssignmentRepository repository,
                                    CourierProfileService courierProfileService,
                                    DeliveryService deliveryService) {
        this.repository = repository;
        this.courierProfileService = courierProfileService;
        this.deliveryService = deliveryService;
    }

    public List<AnnouncementAssignment> list(Long announcementId) {
        return repository.listByAnnouncement(announcementId);
    }

    @Transactional
    public AnnouncementAssignment assign(AppUser courier, Announcement announcement, String note) {
        courierProfileService.requireApproved(courier.getId());
        var id = new AnnouncementAssignmentId();
        id.setAnnouncementId(announcement.getId());
        id.setCourierUserId(courier.getId());
        if (repository.findByIdOptional(id).isPresent()) {
            throw new EcodeliException(Response.Status.CONFLICT,
                    "ANNOUNCEMENT_ALREADY_ASSIGNED",
                    "Vous avez déjà pris en charge cette annonce");
        }
        var assignment = new AnnouncementAssignment();
        assignment.setId(id);
        assignment.setAnnouncement(announcement);
        assignment.setCourier(courier);
        assignment.setAssignedAt(OffsetDateTime.now());
        assignment.setNote(note);
        repository.persist(assignment);
        deliveryService.createOrAssignFromAnnouncement(announcement, courier);
        return assignment;
    }
}
