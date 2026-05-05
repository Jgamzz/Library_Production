package Controllers;

import AppService.BookAppService;
import Domain.Entities.Book;
import DTO.BookAddDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/books")
@Tag(name = "Livros", description = "Gerenciamento do acervo de livros")
public class BookController {

    @Autowired
    private BookAppService bookAppService;

    @GetMapping
    public ResponseEntity<List<Book>> listar() {
        return ResponseEntity.ok(bookAppService.listarTodos());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Cadastra livro e salva imagem no Desktop")
    public ResponseEntity<Book> criar(
            @RequestPart("bookDto")
            @io.swagger.v3.oas.annotations.media.Schema(implementation = BookAddDTO.class) String bookJson,
            @RequestPart("image") MultipartFile image) throws IOException {
        Book novoLivro = bookAppService.salvarComImagem(bookJson, image);
        return ResponseEntity.status(201).body(novoLivro);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Book> atualizar(@PathVariable Integer id, @RequestBody Book book) {
        book.setId(id);
        return ResponseEntity.ok(bookAppService.salvar(book));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        bookAppService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}