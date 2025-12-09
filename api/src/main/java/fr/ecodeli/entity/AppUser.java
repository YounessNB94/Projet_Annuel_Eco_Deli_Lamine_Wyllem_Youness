package fr.ecodeli.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "app_user",
        indexes = {
                @Index(name = "ix_app_user_email", columnList = "email"),
                @Index(name = "ix_app_user_keycloak", columnList = "keycloak_user_id")
        })
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Setter(AccessLevel.NONE)
    private Long id;

    @Column(name = "keycloak_user_id", nullable = false, unique = true, length = 64)
    private String keycloakUserId;

    @Column(nullable = false, unique = true, length = 320)
    private String email;

    @Column(length = 32)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private AppUserStatus status;

    @Column(name = "created_at", nullable = false)
    @Setter(AccessLevel.NONE)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    @Setter(AccessLevel.NONE)
    private OffsetDateTime updatedAt;

    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY)
    private UserProfile profile;

    @OneToMany(mappedBy = "user")
    private final List<UserAddress> addresses = new ArrayList<>();

    @PrePersist
    void onPersist() {
        var now = OffsetDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }
}
