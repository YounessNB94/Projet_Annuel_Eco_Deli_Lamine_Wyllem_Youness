package fr.ecodeli.service;

import fr.ecodeli.config.DocumentStorageProperties;
import fr.ecodeli.entity.Document;
import fr.ecodeli.entity.DocumentAccess;
import fr.ecodeli.entity.DocumentAccessId;
import fr.ecodeli.entity.DocumentType;
import fr.ecodeli.repository.DocumentAccessRepository;
import fr.ecodeli.repository.DocumentRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.NotAllowedException;
import jakarta.ws.rs.NotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.UUID;
import org.jboss.logging.Logger;

@ApplicationScoped
public class DocumentService {

    private static final Logger LOG = Logger.getLogger(DocumentService.class);

    private final DocumentRepository documentRepository;
    private final DocumentAccessRepository accessRepository;
    private final Path storageDirectory;
    private final long maxSizeBytes;

    @Inject
    public DocumentService(DocumentRepository documentRepository,
                           DocumentAccessRepository accessRepository,
                           DocumentStorageProperties config) {
        this.documentRepository = documentRepository;
        this.accessRepository = accessRepository;
        this.storageDirectory = Path.of(config.storagePath());
        this.maxSizeBytes = config.maxSizeBytes();
        initStorageDirectory();
    }

    private void initStorageDirectory() {
        try {
            Files.createDirectories(storageDirectory);
        } catch (IOException e) {
            throw new IllegalStateException("Unable to create documents storage directory", e);
        }
    }

    @Transactional
    public Document store(byte[] content, String fileName, String mimeType, long ownerUserId) {
        return store(content, fileName, mimeType, ownerUserId, DocumentType.OTHER);
    }

    @Transactional
    public Document store(byte[] content, String fileName, String mimeType, long ownerUserId, DocumentType type) {
        if (content.length > maxSizeBytes) {
            throw new NotAllowedException("File too large");
        }
        var document = new Document();
        document.setType(type == null ? DocumentType.OTHER : type);
        document.setStorageKey(generateStorageKey(fileName, document.getType()));
        document.setFileName(fileName);
        document.setMimeType(mimeType);
        document.setSizeBytes((long) content.length);
        document.setSha256(hash(content));
        documentRepository.persistAndFlush(document);

        writeToDisk(document.getStorageKey(), content);
        grantAccess(document, ownerUserId, true);
        return document;
    }

    public Document requireAccess(Long documentId, Long userId) {
        var document = documentRepository.findByIdOptional(documentId)
                .orElseThrow(NotFoundException::new);
        var access = accessRepository.findByIdOptional(new DocumentAccessId(documentId, userId))
                .orElseThrow(ForbiddenException::new);
        if (!access.isCanRead()) {
            throw new ForbiddenException();
        }
        return document;
    }

    public byte[] readContent(Document document) {
        var path = storageDirectory.resolve(document.getStorageKey());
        try {
            return Files.readAllBytes(path);
        } catch (IOException e) {
            throw new NotFoundException("Document content unavailable");
        }
    }

    @Transactional
    public void grantAccess(Document document, long userId, boolean canRead) {
        var accessId = new DocumentAccessId(document.getId(), userId);
        if (accessRepository.findByIdOptional(accessId).isPresent()) {
            return;
        }
        var access = DocumentAccess.of(document, userId, canRead);
        accessRepository.persist(access);
    }

    private void writeToDisk(String storageKey, byte[] content) {
        var path = storageDirectory.resolve(storageKey);
        try {
            Files.createDirectories(path.getParent());
            Files.write(path, content);
        } catch (IOException e) {
            LOG.errorf(e, "Failed to write document %s", storageKey);
            throw new IllegalStateException("Failed to store document", e);
        }
    }

    private String generateStorageKey(String fileName, DocumentType type) {
        var sanitized = fileName.replaceAll("\\s+", "-");
        var directory = switch (type) {
            case CONTRACT -> "contracts";
            case INVOICE -> "invoices";
            case COURIER_PROOF -> "courier";
            default -> "other";
        };
        return directory + "/" + UUID.randomUUID() + "-" + sanitized;
    }

    private String hash(byte[] content) {
        try {
            var digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(content));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }

    public Path resolveStoragePath(String storageKey) {
        return storageDirectory.resolve(storageKey);
    }

    public Document getMetadata(Long documentId, Long userId) {
        return requireAccess(documentId, userId);
    }

    public InputStream openStream(Document document) {
        var path = resolveStoragePath(document.getStorageKey());
        try {
            return Files.newInputStream(path);
        } catch (IOException e) {
            throw new NotFoundException("Document content unavailable");
        }
    }
}
