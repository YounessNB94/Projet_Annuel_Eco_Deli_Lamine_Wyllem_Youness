package fr.ecodeli.config;

import io.smallrye.config.ConfigMapping;
import io.smallrye.config.WithDefault;

@ConfigMapping(prefix = "ecodeli.documents")
public interface DocumentStorageProperties {

    @WithDefault("src/main/resources/documents")
    String storagePath();

    /**
     * Maximum document size in bytes.
     *
     * @return the maximum size in bytes
     */
    @WithDefault("10485760") // default 10MB
    long maxSizeBytes();
}