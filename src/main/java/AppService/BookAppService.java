package AppService;

import DTO.BookAddDTO;
import Domain.Entities.Book;
import Repository.BookRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class BookAppService {

    @Autowired
    private BookRepository bookRepository;
/// onde salva os arquivos, mudar dps
    private final String uploadFolder = "C:/Users/kaua.moraes/Desktop/Library/imagens/";

    public List<Book> listarTodos() {
        return bookRepository.findAll();
    }

    @Transactional
    public Book salvarComImagem(String bookJson, MultipartFile image) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        BookAddDTO bookDto = objectMapper.readValue(bookJson, BookAddDTO.class);

        Path path = Paths.get(uploadFolder);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }
        String extension = image.getOriginalFilename().substring(image.getOriginalFilename().lastIndexOf("."));
        String fileName = UUID.randomUUID().toString() + extension;


        Files.copy(image.getInputStream(), path.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);

        Book novoLivro = new Book();
        novoLivro.setName(bookDto.getName());
        novoLivro.setDescription(bookDto.getDescription());
        novoLivro.setAuthor(bookDto.getAuthor());
        novoLivro.setReleaseYear(bookDto.getReleaseYear());

        novoLivro.setImage("http://localhost:8080/uploads/" + fileName);

        log.info("Salvando livro e imagem: {}", novoLivro.getName());
        return bookRepository.save(novoLivro);
    }

    @Transactional
    public Book salvar(Book book) {
        return bookRepository.save(book);
    }

    @Transactional
    public void deletar(Integer id) {
        if (!bookRepository.existsById(id)) {
            throw new RuntimeException("Livro não encontrado para exclusão");
        }
        bookRepository.deleteById(id);
    }
}