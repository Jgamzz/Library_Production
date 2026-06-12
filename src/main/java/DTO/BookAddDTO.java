package DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookAddDTO {
        private String name;
        private String description;
        private String author;
        private Integer releaseYear;
}