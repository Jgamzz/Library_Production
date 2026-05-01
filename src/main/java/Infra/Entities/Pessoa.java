package Infra.Entities;

import java.math.BigDecimal;

public record Pessoa(String nome, Integer idade, BigDecimal salario, Profissao profissao) {
}