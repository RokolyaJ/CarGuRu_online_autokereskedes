package com.autokereskedes.backend.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {
    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dxo3qks6f",
                "api_key", "296582891687593",
                "api_secret", "g2GrLsAhkH1TVhibDYlZHdIGsrc",
                "secure", true
        ));
    }
}
