package com.humanresourcesapp.utility;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;
import java.util.Base64;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

public class PasswordHasher {

    private static final String SECRET_KEY_FACTORY_ALGORITHM = "PBKDF2WithHmacSHA1";
    private static final int SALT_LENGTH = 16;
    private static final int HASH_ITERATIONS = 65536;
    private static final int HASH_KEY_LENGTH = 128;

    public static String hashPassword(String password, byte[] salt) {
        KeySpec spec = new PBEKeySpec(password.toCharArray(), salt, HASH_ITERATIONS, HASH_KEY_LENGTH);
        try {
            SecretKeyFactory factory = SecretKeyFactory.getInstance(SECRET_KEY_FACTORY_ALGORITHM);
            byte[] hash = factory.generateSecret(spec).getEncoded();
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            throw new RuntimeException("Error while hashing a password: " + e.getMessage(), e);
        }
    }

    public static byte[] generateSalt() {
        byte[] salt = new byte[SALT_LENGTH];
        new SecureRandom().nextBytes(salt);
        return salt;
    }

    public static boolean verifyPassword(String password, String hashedPassword, byte[] salt) {
        String hashToVerify = hashPassword(password, salt);
        return hashedPassword.equals(hashToVerify);
    }


}
