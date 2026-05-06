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
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado para exclusão"));

        String imageUrl = book.getImage();
        if (imageUrl != null && imageUrl.contains("/uploads/")) {
            String fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
            Path filePath = Paths.get(uploadFolder).resolve(fileName);

            try {
                if (Files.exists(filePath)) {
                    Files.delete(filePath);
                    log.info("Imagem deletada com sucesso: {}", fileName);
                }
            } catch (IOException e) {
                log.error("Erro ao deletar arquivo físico: {}", e.getMessage());
                throw  new RuntimeException("Falha ao fazer excluão so livro! ");
                // Opcional: Você pode decidir se interrompe a transação ou apenas loga o erro
            }
        }


        bookRepository.delete(book);
        log.info("Registro do livro ID {} removido do banco.", id);
    }
    @Transactional
    public Book atualizarComImagem(Integer id, String bookJson, MultipartFile image) throws IOException {

        Book livroExistente = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado com ID: " + id));

        ObjectMapper objectMapper = new ObjectMapper();
        BookAddDTO bookDto = objectMapper.readValue(bookJson, BookAddDTO.class);

        livroExistente.setName(bookDto.getName());
        livroExistente.setDescription(bookDto.getDescription());
        livroExistente.setAuthor(bookDto.getAuthor());
        livroExistente.setReleaseYear(bookDto.getReleaseYear());

        if (image != null && !image.isEmpty()) {
            deletarArquivoFisico(livroExistente.getImage());

            String extension = image.getOriginalFilename().substring(image.getOriginalFilename().lastIndexOf("."));
            String fileName = UUID.randomUUID().toString() + extension;
            Path path = Paths.get(uploadFolder);
            Files.copy(image.getInputStream(), path.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);

            livroExistente.setImage("http://localhost:8080/uploads/" + fileName);
        }
        return bookRepository.save(livroExistente);
    }

    private void deletarArquivoFisico(String imageUrl) {
        if (imageUrl != null && imageUrl.contains("/uploads/")) {
            String fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
            try {
                Files.deleteIfExists(Paths.get(uploadFolder).resolve(fileName));
            } catch (IOException e) {
                log.error("Erro ao remover imagem antiga: " + e.getMessage());
            }
        }
    }
}