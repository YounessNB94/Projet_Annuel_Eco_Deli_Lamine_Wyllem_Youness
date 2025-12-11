package fr.ecodeli.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "announcement_assignment")
public class AnnouncementAssignment {

    @EmbeddedId
    private AnnouncementAssignmentId id = new AnnouncementAssignmentId();

    @MapsId("announcementId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "announcement_id", nullable = false)
    private Announcement announcement;

    @MapsId("courierUserId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "courier_user_id", nullable = false)
    private AppUser courier;

    @Column(name = "assigned_at", nullable = false)
    private OffsetDateTime assignedAt = OffsetDateTime.now();

    @Column(length = 500)
    private String note;
}

