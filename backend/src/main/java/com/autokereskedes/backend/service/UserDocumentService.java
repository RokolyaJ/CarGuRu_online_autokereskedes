package com.autokereskedes.backend.service;

import com.autokereskedes.backend.model.User;
import com.autokereskedes.backend.model.UserDocument;
import com.autokereskedes.backend.repository.UserDocumentRepository;
import com.autokereskedes.backend.repository.UserRepository;
import com.cloudinary.Cloudinary;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.cloudinary.utils.ObjectUtils;

import java.time.OffsetDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class UserDocumentService {

    private final UserRepository userRepository;
    private final UserDocumentRepository documentRepo;
    private final Cloudinary cloudinary;

    public UserDocument uploadOrUpdateFile(Long userId, String type, MultipartFile file) throws Exception {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Felhasználó nem található"));
        String safeId = UUID.randomUUID().toString();

        Map<String, Object> uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", "documents/" + user.getUsername(),
                        "resource_type", "raw",
                        "public_id", safeId,
                        "overwrite", true
                )
        );
        String url = uploadResult.get("secure_url").toString();

        Optional<UserDocument> existing = documentRepo.findByUserIdAndType(userId, type);

        if (existing.isPresent()) {
            UserDocument doc = existing.get();
            doc.setUrl(url);
            doc.setStatus("PENDING");
            doc.setUploadedAt(OffsetDateTime.now());
            return documentRepo.save(doc);
        }

        UserDocument newDoc = new UserDocument();
        newDoc.setUser(user);
        newDoc.setType(type);
        newDoc.setUrl(url);
        newDoc.setStatus("PENDING");
        newDoc.setUploadedAt(OffsetDateTime.now());

        return documentRepo.save(newDoc);
    }


    public void deleteDocument(Long id) throws Exception {
        Optional<UserDocument> docOpt = documentRepo.findById(id);

        if (docOpt.isEmpty())
            return;

        UserDocument doc = docOpt.get();

        String url = doc.getUrl();
        String fileName = url.substring(url.lastIndexOf("/") + 1);
        String publicId = fileName.contains(".")
                ? fileName.substring(0, fileName.lastIndexOf("."))
                : fileName;
        cloudinary.uploader().destroy(
                "documents/" + doc.getUser().getUsername() + "/" + publicId,
                Map.of()
        );

        documentRepo.delete(doc);
    }

    public List<UserDocument> getUserDocuments(Long userId) {
        return documentRepo.findByUserId(userId);
    }
}
