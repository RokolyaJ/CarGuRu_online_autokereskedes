package com.autokereskedes.backend.controller;

import com.autokereskedes.backend.model.User;
import com.autokereskedes.backend.service.ProfileImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserProfileController {

    private final ProfileImageService profileImageService;

   @PutMapping("/set-profile-picture")
@PreAuthorize("isAuthenticated()")
public ResponseEntity<Map<String, String>> setExistingProfilePicture(
        @RequestBody Map<String, String> body,
        @AuthenticationPrincipal User user
) {
    String imageUrl = body.get("imageUrl");

    if (imageUrl == null || imageUrl.isEmpty()) {
        return ResponseEntity.badRequest().body(Map.of("error", "imageUrl is required"));
    }

    user.setProfileImage(imageUrl);

    profileImageService.updateUserProfileImage(user);

    return ResponseEntity.ok(Map.of(
            "message", "Profile picture updated",
            "url", imageUrl
    ));
}
@PostMapping("/upload-profile-picture")
@PreAuthorize("isAuthenticated()")
public ResponseEntity<Map<String, String>> uploadProfilePicture(
        @RequestParam("file") MultipartFile file,
        @AuthenticationPrincipal User user
) {
    String url = profileImageService.saveProfileImage(user.getId(), file);
    return ResponseEntity.ok(Map.of("url", url));
}

    
}
