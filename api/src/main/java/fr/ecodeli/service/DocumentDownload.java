package fr.ecodeli.service;

import fr.ecodeli.entity.Document;
import java.io.InputStream;

public record DocumentDownload(Document document, InputStream stream) {
}

