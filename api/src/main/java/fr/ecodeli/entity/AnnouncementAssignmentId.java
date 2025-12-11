package fr.ecodeli.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode
@Embeddable
public class AnnouncementAssignmentId implements Serializable {

    @Column(name = "announcement_id")
    private Long announcementId;

    @Column(name = "courier_user_id")
    private Long courierUserId;
}

