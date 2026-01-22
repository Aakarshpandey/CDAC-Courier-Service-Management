package com.cms.CourierKaro.entity;

import java.sql.Timestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="PARTNER_PAYOUTS")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PartnerPayout {
	
	@Id	
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="payout_id")
	private Long payoutId;
	
	@ManyToOne
	@JoinColumn(name = "partner_id")
	private Partner partner;
	
	@OneToOne
	@JoinColumn(name="shipment_id")
	private Shipment shipment;
	
	private Double amount;
	
	@Enumerated(EnumType.STRING)
	@Column(name="status")
	private PaymentStatus paymentStatus;
	
	@Column(name="paid_at")
	private Timestamp paidAt;
}
