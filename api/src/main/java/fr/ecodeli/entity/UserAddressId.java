package fr.ecodeli.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Embeddable
public class UserAddressId implements Serializable {

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "address_id", nullable = false)
    private Long addressId;
}
