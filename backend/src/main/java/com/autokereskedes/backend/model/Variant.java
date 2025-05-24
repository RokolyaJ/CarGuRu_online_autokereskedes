package com.autokereskedes.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "variant")
@Getter
@Setter
@NoArgsConstructor
public class Variant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String price;

    private String power;

    private String drive;

    private String range;

    @Column(name = "image_url")
    private String imageUrl;


    @ManyToOne
    @JoinColumn(name = "model_id", nullable = false)
    private Model model;


    @OneToMany(mappedBy = "variant")
    @JsonIgnore 
    private List<Engine> engines;
}
