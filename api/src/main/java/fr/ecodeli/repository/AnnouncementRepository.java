package fr.ecodeli.repository;

import fr.ecodeli.entity.Announcement;
import fr.ecodeli.entity.AnnouncementStatus;
import fr.ecodeli.entity.AnnouncementType;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ApplicationScoped
public class AnnouncementRepository implements PanacheRepository<Announcement> {

    public List<Announcement> listByFilter(Long creatorUserId,
                                           boolean mineOnly,
                                           AnnouncementStatus status,
                                           AnnouncementType type) {
        var query = new StringBuilder("1=1");
        Map<String, Object> params = new HashMap<>();
        if (status != null) {
            query.append(" AND status = :status");
            params.put("status", status);
        }
        if (type != null) {
            query.append(" AND type = :type");
            params.put("type", type);
        }
        if (mineOnly && creatorUserId != null) {
            query.append(" AND createdBy.id = :creatorId");
            params.put("creatorId", creatorUserId);
        }
        return find(query.toString(), params).list();
    }

    public List<Announcement> searchForAdmin(AnnouncementStatus status,
                                             AnnouncementType type,
                                             Long merchantCompanyId) {
        var query = new StringBuilder("1=1");
        Map<String, Object> params = new HashMap<>();
        if (status != null) {
            query.append(" AND status = :status");
            params.put("status", status);
        }
        if (type != null) {
            query.append(" AND type = :type");
            params.put("type", type);
        }
        if (merchantCompanyId != null) {
            query.append(" AND merchantCompany.id = :merchantCompanyId");
            params.put("merchantCompanyId", merchantCompanyId);
        }
        return find(query.toString(), params).list();
    }
}
