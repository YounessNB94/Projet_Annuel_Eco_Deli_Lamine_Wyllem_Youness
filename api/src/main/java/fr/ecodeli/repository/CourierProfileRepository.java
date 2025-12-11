package fr.ecodeli.repository;

import fr.ecodeli.entity.CourierProfile;
import fr.ecodeli.entity.CourierProfileStatus;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;

@ApplicationScoped
public class CourierProfileRepository implements PanacheRepository<CourierProfile> {

    public List<CourierProfile> search(CourierProfileStatus status, Boolean hasDocuments, String search) {
        var query = new StringBuilder("SELECT cp FROM CourierProfile cp WHERE 1=1");
        var params = new java.util.HashMap<String, Object>();
        if (status != null) {
            query.append(" AND cp.status = :status");
            params.put("status", status);
        }
        if (Boolean.TRUE.equals(hasDocuments)) {
            query.append(" AND EXISTS (SELECT 1 FROM CourierDocument cd WHERE cd.courier = cp.user)");
        }
        if (search != null && !search.isBlank()) {
            query.append(" AND (LOWER(cp.user.email) LIKE :search OR LOWER(cp.user.profile.firstName) LIKE :search OR LOWER(cp.user.profile.lastName) LIKE :search)");
            params.put("search", "%" + search.toLowerCase() + "%");
        }
        var typedQuery = getEntityManager().createQuery(query.toString(), CourierProfile.class);
        params.forEach(typedQuery::setParameter);
        return typedQuery.getResultList();
    }
}
