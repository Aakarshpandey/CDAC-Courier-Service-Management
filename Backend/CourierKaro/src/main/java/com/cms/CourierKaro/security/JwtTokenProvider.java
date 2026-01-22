package com.cms.CourierKaro.security;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;

public class JwtTokenProvider {
	
	@Value("$(app.jwt.secret)")
	private String jwtSecret;
	
	@Value("$(app.jwt.expiration)")
	private long jwtExpirationMs;

	@Value("$(app.jwt.expiration-remember)")
	private long jwtRememberMeExpirationMs;
	
	private Key getSigningKey() {
		return Keys.hmacShaKeyFor(jwtSecret.getBytes());
	}
	
	public String generateToken(String email, String userType, boolean rememberMe) {
		Date now = new Date();
		long expiration = rememberMe ? jwtRememberMeExpirationMs : jwtExpirationMs;
		Date expiryDate = new Date(now.getTime() + expiration);
		
		return Jwts.builder()
				.setSubject(email)
				.claim("userType", userType)
				.setIssuedAt(now)
				.setExpiration(expiryDate)
				.signWith(getSigningKey(),SignatureAlgorithm.HS256)
				.compact();
	}
	
	public String getEmailFromToken(String token) {
		Claims claims = Jwts.parserBuilder()
				.setSigningKey(getSigningKey())
				.build()
				.parseClaimsJws(token)
				.getBody();
		return claims.getSubject();
	}
	
	public String getUserTypeFromToken(String token) {
		Claims claims = Jwts.parserBuilder()
				.setSigningKey(getSigningKey())
				.build()
				.parseClaimsJws(token)
				.getBody();
		return claims.get("userType",String.class);
	}
	
	public boolean validateToken(String token) {
		try {
			Jwts.parserBuilder()
			.setSigningKey(getSigningKey())
			.build()
			.parseClaimsJws(token);
			return true;
		}
		catch (MalformedJwtException ex) {
			System.out.println("Invalid JWT Token");
		}
		catch (ExpiredJwtException ex) {
			System.out.println("Expired JWT token");
		}
		catch (UnsupportedJwtException ex) {
			System.out.println("Unsupported JWT token");
		}
		catch (IllegalArgumentException ex) {
			System.out.println("JWT claims string is empty");
		}
		return false;
		}
	}
	
