package com.cms.CourierKaro.entity;

import java.sql.Timestamp;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "partner_locations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PartnerLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "location_id")
    private Long id;   


    @ManyToOne
    @JoinColumn(name = "partner_id", nullable = false)
    private Partner partner;  

    private Double lat;
    private Double lng;

    @Column(name = "is_online")
    private boolean isOnline;

    private Timestamp timestamp;
}
