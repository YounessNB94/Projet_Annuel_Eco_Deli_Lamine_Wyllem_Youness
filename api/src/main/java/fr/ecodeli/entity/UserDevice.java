package fr.ecodeli.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "user_device",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_user_device_player", columnNames = {"onesignal_player_id"})
        },
        indexes = {
                @Index(name = "ix_user_device_user", columnList = "user_id")
        })
public class UserDevice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @Column(name = "onesignal_player_id", nullable = false, length = 128)
    private String onesignalPlayerId;

    @Column(name = "platform", nullable = false, length = 32)
    private String platform;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "last_active_at")
    private OffsetDateTime lastActiveAt;

    @PrePersist
    void onPersist() {
        var now = OffsetDateTime.now();
        createdAt = now;
        lastActiveAt = now;
    }
}

