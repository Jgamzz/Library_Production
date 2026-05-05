package Infra.Config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class Error {

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> tratarErro401(BadCredentialsException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("status", 401);
        body.put("erro", "Unauthorized");
        body.put("mensagem", ex.getMessage());

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }
}