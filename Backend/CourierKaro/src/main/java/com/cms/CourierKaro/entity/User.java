package com.cms.CourierKaro.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Getter
@Setter
@ToString
@NoArgsConstructor
@Entity
@Table(name="users")
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="user_id")
	private Long id;
	
	@Column(length=100, nullable=false, unique=true)
	private String email;
	
	@Column(length= 400)
	private String password;
	
	@Column(name="first_name",length=100)
	private String firstName;
	
	@Column(name="last_name",length=100)
	private String lastName;
	
	
	@Column(name="phone_number",length=15)
	private String phoneNumber;
	
	@Column(name="profile_photo_url")
	private String profilePhotoUrl;
	
	@Enumerated(EnumType.STRING)
	private Role role;
	
	@Column(name="created_at")
	@CreationTimestamp
	private LocalDateTime createdAt;
		
}
