package com.humanresourcesapp.utility;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.humanresourcesapp.entities.Auth;
import com.humanresourcesapp.exception.ErrorType;
import com.humanresourcesapp.exception.HumanResourcesAppException;
import org.springframework.stereotype.Component;
import java.util.Date;
import java.util.Optional;

@Component
public class JwtTokenManager
{


    String secretKey  = "KOXSfvS1nc3D1drMlHMjtdIXYnqQWlFQ1ebrwT1SQAFBQWOQRw";

    String issuer  = "HumanResourcesApp";
    Long expireTime = 1000L * 60 * 60; //60 dakikalık zaman

    //1. token üretmeli.
    public Optional<String> createTokenFromAuth(Auth auth)
    {
        String token = "";

        /**
         * Dikkat!
         * Claim objeleri içindeki değerler herkes tarafından görülebilir.
         * O yüzden claimler ile e-mail, password gibi herkesin görmesini istemediğimiz bilgileri payload kısmında tutmayız.
         */

        try
        {
            token = JWT.create()
                    .withAudience()
                    .withClaim("id", auth.getId())
                    .withClaim("userType", auth.getUserType().name())
                    .withIssuer(issuer)
                    .withIssuedAt(new Date()) //Tokenın yaratıldığı an.
                    .withExpiresAt(new Date(System.currentTimeMillis() + expireTime)) //Date, Instant
                    .sign(Algorithm.HMAC512(secretKey));

            return Optional.of(token);

        } catch (IllegalArgumentException | JWTCreationException e)
        {
            throw new HumanResourcesAppException(ErrorType.TOKEN_CREATION_FAILED);

        }


    }




    public Optional<Long> getAuthIdFromToken(String token)
    {
        try
        {
            Algorithm algorithm = Algorithm.HMAC512(secretKey);
            JWTVerifier verifier = JWT.require(algorithm).withIssuer(issuer).build();
            DecodedJWT decodedJWT = verifier.verify(token);

            if (decodedJWT==null)
            {
                return Optional.empty();

            }


            return Optional.of(decodedJWT.getClaim("id").asLong());
        } catch (IllegalArgumentException e)
        {

            throw new HumanResourcesAppException(ErrorType.TOKEN_ARGUMENT_NOTVALID);
        } catch (JWTVerificationException e)
        {
            throw new HumanResourcesAppException(ErrorType.TOKEN_VERIFY_FAILED);
        }

    }

    public Optional<String> getUserTypeFromToken(String token)
    {

        try
        {
            Algorithm algorithm = Algorithm.HMAC512(secretKey);
            JWTVerifier verifier = JWT.require(algorithm).withIssuer(issuer).build();
            DecodedJWT decodedJWT = verifier.verify(token);

            if (decodedJWT==null)
            {
                return Optional.empty();

            }

            return Optional.of(decodedJWT.getClaim("userType").asString());
        } catch (IllegalArgumentException e)
        {

            throw new HumanResourcesAppException(ErrorType.TOKEN_ARGUMENT_NOTVALID);
        } catch (JWTVerificationException e)
        {
            throw new HumanResourcesAppException(ErrorType.TOKEN_VERIFY_FAILED);
        }


    }



}
