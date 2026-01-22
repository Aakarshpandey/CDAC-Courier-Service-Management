package com.cms.CourierKaro.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "system_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SystemLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long logId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User userId;

    @Column(name = "action", nullable = false, length = 255)
    private String action;

    @Column(name = "entity", nullable = false, length = 100)
    private String entity;

    @Column(name = "entity_id", length = 100)
    private String entityId;

    @Column(name = "timestamp", updatable = false)
    private LocalDateTime timestamp = LocalDateTime.now();
}