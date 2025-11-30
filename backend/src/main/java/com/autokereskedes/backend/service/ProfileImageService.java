package com.autokereskedes.backend.service;

import com.autokereskedes.backend.model.User;
import com.autokereskedes.backend.repository.UserRepository;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProfileImageService {

    private final UserRepository userRepository;
    private final Cloudinary cloudinary;

    public String saveProfileImage(Long userId, MultipartFile file) {

        try {
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "profile_images",  
                            "public_id", "user_" + userId 
                    )
            );

            String imageUrl = uploadResult.get("secure_url").toString();
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found: " + userId));

            user.setProfileImage(imageUrl);
            userRepository.save(user);
            return imageUrl;

        } catch (IOException e) {
            throw new RuntimeException("Cloudinary upload failed!", e);
        }
    }
    public void updateUserProfileImage(User user) {
    userRepository.save(user);
}

}
