package fr.ecodeli.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import jakarta.persistence.Index;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "document_access", indexes = {
        @Index(name = "ix_document_access_user", columnList = "user_id")
})
public class DocumentAccess {

    @EmbeddedId
    private DocumentAccessId id;

    @MapsId("documentId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @MapsId("userId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @Column(name = "can_read", nullable = false)
    private boolean canRead = true;

    public static DocumentAccess of(Document document, long userId, boolean canRead) {
        var access = new DocumentAccess();
        access.setDocument(document);
        var user = AppUser.builder()
                .id(userId)
                .build();
        access.setUser(user);
        access.setId(new DocumentAccessId(document.getId(), userId));
        access.setCanRead(canRead);
        return access;
    }
}
