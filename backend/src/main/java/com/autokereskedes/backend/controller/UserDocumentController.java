package com.autokereskedes.backend.controller;

import com.autokereskedes.backend.model.UserDocument;
import com.autokereskedes.backend.service.UserDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
@CrossOrigin(
        origins = "*",
        allowedHeaders = {"Authorization", "Content-Type"},
        exposedHeaders = {"Authorization"}
)
public class UserDocumentController {

    private final UserDocumentService service;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(
            @RequestParam("userId") Long userId,
            @RequestParam("type") String type,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            return ResponseEntity.ok(service.uploadOrUpdateFile(userId, type, file));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Upload error: " + e.getMessage());
        }
    }

    @GetMapping("/get")
    public ResponseEntity<List<UserDocument>> getDocuments(@RequestParam Long userId) {
        return ResponseEntity.ok(service.getUserDocuments(userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDocument(@PathVariable Long id) {
        try {
            service.deleteDocument(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Deletion error: " + e.getMessage());
        }
    }
}
