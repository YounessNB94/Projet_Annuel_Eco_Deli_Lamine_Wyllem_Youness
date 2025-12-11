package fr.ecodeli.repository;

import fr.ecodeli.entity.ProviderProfile;
import fr.ecodeli.entity.ValidationStatus;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;

@ApplicationScoped
public class ProviderProfileRepository implements PanacheRepository<ProviderProfile> {

    public List<ProviderProfile> search(ValidationStatus status, boolean pendingOnly, String search) {
        var query = new StringBuilder("SELECT pp FROM ProviderProfile pp WHERE 1=1");
        var params = new java.util.HashMap<String, Object>();
        if (pendingOnly) {
            query.append(" AND pp.status = :pending");
            params.put("pending", ValidationStatus.PENDING);
        } else if (status != null) {
            query.append(" AND pp.status = :status");
            params.put("status", status);
        }
        if (search != null && !search.isBlank()) {
            query.append(" AND (LOWER(pp.user.email) LIKE :search")
                    .append(" OR LOWER(pp.user.profile.firstName) LIKE :search")
                    .append(" OR LOWER(pp.user.profile.lastName) LIKE :search)");
            params.put("search", "%" + search.toLowerCase() + "%");
        }
        var typedQuery = getEntityManager().createQuery(query.toString(), ProviderProfile.class);
        params.forEach(typedQuery::setParameter);
        return typedQuery.getResultList();
    }
}
