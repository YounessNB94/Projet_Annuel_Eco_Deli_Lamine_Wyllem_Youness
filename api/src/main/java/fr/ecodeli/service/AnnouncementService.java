package fr.ecodeli.service;

import fr.ecodeli.entity.Announcement;
import fr.ecodeli.entity.AnnouncementStatus;
import fr.ecodeli.entity.AnnouncementType;
import fr.ecodeli.entity.AppUser;
import fr.ecodeli.repository.AnnouncementRepository;
import fr.ecodeli.web.exception.EcodeliException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;
import java.util.List;

@ApplicationScoped
public class AnnouncementService {

    private final AnnouncementRepository repository;

    @Inject
    public AnnouncementService(AnnouncementRepository repository) {
        this.repository = repository;
    }

    public Announcement getRequired(Long id) {
        return repository.findByIdOptional(id)
                .orElseThrow(() -> new EcodeliException(Response.Status.NOT_FOUND,
                        "ANNOUNCEMENT_NOT_FOUND",
                        "Annonce introuvable"));
    }

    public List<Announcement> list(AppUser requester,
                                   boolean mineOnly,
                                   AnnouncementStatus status,
                                   AnnouncementType type) {
        return repository.listByFilter(requester.getId(), mineOnly, status, type);
    }

    public List<Announcement> listPublic(AnnouncementStatus status, AnnouncementType type) {
        return repository.listByFilter(null, false, status, type);
    }

    public List<Announcement> listAllForAdmin(AnnouncementStatus status, AnnouncementType type, Long merchantCompanyId) {
        return repository.searchForAdmin(status, type, merchantCompanyId);
    }

    @Transactional
    public Announcement create(AppUser creator, Announcement announcement) {
        announcement.setId(null);
        announcement.setCreatedBy(creator);
        announcement.setStatus(AnnouncementStatus.DRAFT);
        repository.persist(announcement);
        return announcement;
    }

    @Transactional
    public Announcement updateDraft(AppUser requester, Long id, Announcement payload) {
        var existing = getRequired(id);
        ensureOwnership(requester, existing);
        ensureDraft(existing);
        existing.setTitle(payload.getTitle());
        existing.setDescription(payload.getDescription());
        existing.setType(payload.getType());
        existing.setFromAddress(payload.getFromAddress());
        existing.setToAddress(payload.getToAddress());
        existing.setEarliestAt(payload.getEarliestAt());
        existing.setLatestAt(payload.getLatestAt());
        existing.setBudgetCents(payload.getBudgetCents());
        existing.setCurrency(payload.getCurrency());
        existing.setMerchantCompany(payload.getMerchantCompany());
        existing.setUpdatedAt(java.time.OffsetDateTime.now());
        return existing;
    }

    @Transactional
    public Announcement publish(AppUser requester, Long id) {
        var announcement = getRequired(id);
        ensureOwnership(requester, announcement);
        ensureDraft(announcement);
        announcement.setStatus(AnnouncementStatus.PUBLISHED);
        announcement.setUpdatedAt(java.time.OffsetDateTime.now());
        return announcement;
    }

    @Transactional
    public Announcement cancel(AppUser requester, Long id) {
        var announcement = getRequired(id);
        ensureOwnership(requester, announcement);
        if (announcement.getStatus() == AnnouncementStatus.CANCELLED) {
            return announcement;
        }
        announcement.setStatus(AnnouncementStatus.CANCELLED);
        announcement.setUpdatedAt(java.time.OffsetDateTime.now());
        return announcement;
    }

    private void ensureOwnership(AppUser requester, Announcement announcement) {
        if (!announcement.getCreatedBy().getId().equals(requester.getId())) {
            throw new EcodeliException(Response.Status.FORBIDDEN,
                    "ANNOUNCEMENT_FORBIDDEN",
                    "Annonce non accessible");
        }
    }

    private void ensureDraft(Announcement announcement) {
        if (announcement.getStatus() != AnnouncementStatus.DRAFT) {
            throw new EcodeliException(Response.Status.BAD_REQUEST,
                    "ANNOUNCEMENT_NOT_DRAFT",
                    "L'annonce n'est plus éditable");
        }
    }
}
