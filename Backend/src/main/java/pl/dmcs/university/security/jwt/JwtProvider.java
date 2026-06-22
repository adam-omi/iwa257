package pl.dmcs.university.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import pl.dmcs.university.security.services.UserPrinciple;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtProvider {

    // Poprawione nazwy kluczy tak, aby pasowały do application.properties
    @Value("${grokonez.app.jwtSecret}")
    private String jwtSecret;

    @Value("${grokonez.app.jwtExpiration}")
    private long jwtExpiration;

    public String generateJwtToken(Authentication authentication) {
        UserPrinciple userPrinciple = (UserPrinciple) authentication.getPrincipal();

        SecretKey secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));

        return Jwts.builder()
                .setSubject(userPrinciple.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpiration * 1000))
                // Poprawiona składnia dla wersji 0.11.5
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            SecretKey secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));

            // Poprawiona składnia weryfikacji tokena dla wersji 0.11.5
            Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(authToken);
            return true;
        } catch (SignatureException e) {
            System.out.println("Invalid JWT signature -> Message: {} " + e);
        } catch (MalformedJwtException e) {
            System.out.println("Invalid JWT token -> Message: {}" + e);
        } catch (ExpiredJwtException e) {
            System.out.println("Expired JWT token -> Message: {}" + e);
        } catch (UnsupportedJwtException e) {
            System.out.println("Unsupported JWT token -> Message: {}" + e);
        } catch (IllegalArgumentException e) {
            System.out.println("JWT claims string is empty -> Message: {}" + e);
        }

        return false;
    }

    public String getUserNameFromJwtToken(String token) {
        SecretKey secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));

        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}