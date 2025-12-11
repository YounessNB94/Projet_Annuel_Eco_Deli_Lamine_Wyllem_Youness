package fr.ecodeli.repository;

import fr.ecodeli.entity.AnnouncementAssignment;
import fr.ecodeli.entity.AnnouncementAssignmentId;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;

@ApplicationScoped
public class AnnouncementAssignmentRepository implements PanacheRepositoryBase<AnnouncementAssignment, AnnouncementAssignmentId> {

    public List<AnnouncementAssignment> listByAnnouncement(Long announcementId) {
        return list("announcement.id", announcementId);
    }
}
