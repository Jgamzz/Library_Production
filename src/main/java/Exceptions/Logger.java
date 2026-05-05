package Exceptions;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class Logger {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGeneralException(Exception ex) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        // Pega apenas a primeira linha relevante do erro para não inundar o arquivo
        StackTraceElement firstLine = ex.getStackTrace().length > 0 ? ex.getStackTrace()[0] : null;
        String location = (firstLine != null)
                ? firstLine.getClassName() + "." + firstLine.getMethodName() + " (Linha: " + firstLine.getLineNumber() + ")"
                : "Local desconhecido";

        // Log limpo no console/arquivo: Horário - Mensagem - Local
        log.error("[{}] ERRO: {} | LOCAL: {}", timestamp, ex.getMessage() != null ? ex.getMessage() : ex.toString(), location);

        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", timestamp);
        body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        body.put("error", "Internal Server Error");
        body.put("message", "Ocorreu um erro interno imprevisto.");

        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}