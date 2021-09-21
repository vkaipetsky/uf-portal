package com.aws.codestar.projecttemplates.controller;

import com.okta.sdk.client.Client;
import com.okta.sdk.resource.application.ApplicationList;
import com.okta.sdk.resource.user.UserList;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.security.*;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;

@RestController
public class AdminController {
    @Autowired
    public Client oktaClient;

    @GetMapping("/users")
    public UserList getUsers() {
        return oktaClient.listUsers();
    }

    @Value("${okta.client.orgUrl}")
    private String oktaOrgUrl;

    @Value("${okta.client.token}")
    private String oktaApiKey;

    @GetMapping("/env")
    public String getEnv() {
        return oktaOrgUrl + " // OBFUSCATED UPPERCASED: " + oktaApiKey.toUpperCase() + "\n";
    }

    public class UnicornUser {
        public String clientId;
        public String clientSecret;
    }

    @GetMapping("/okta_apps")
    public ResponseEntity getKeys() {
//        return oktaClient.listApplications();

        WebClient client = WebClient.create();
        String remoteApiUrl = oktaOrgUrl + "/oauth2/v1/clients?limit=200"; // TODO: implement pagination here
        String response = client.get()
                .uri(remoteApiUrl)
                .header(HttpHeaders.AUTHORIZATION, "SSWS " + oktaApiKey)
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .block()
                .bodyToMono(String.class)
                .block();

        return ResponseEntity.ok(response);
    }

    @RequestMapping(path = "/clients/delete", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity deleteApp(@RequestParam String accessToken, @RequestParam String appIdToDelete) {
        String report = "deleteApp got called for id: " + appIdToDelete;
        System.out.println(report);

        WebClient client = WebClient.create();
        String remoteApiUrl = oktaOrgUrl + "/oauth2/v1/clients/" + appIdToDelete;
        String response = client.delete()
                .uri(remoteApiUrl)
                .header(HttpHeaders.AUTHORIZATION, "SSWS " + oktaApiKey)
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .block()
                .bodyToMono(String.class)
                .block();

        // and delete the app

        JSONObject jsonResponse = new JSONObject();
        jsonResponse.put( "remoteApiUrlQueried", remoteApiUrl );
        jsonResponse.put( "responseReceived", response );

        return ResponseEntity.ok(jsonResponse.toString());
    }

    @RequestMapping(path = "/clients/create", method = RequestMethod.POST, produces = "application/json")
    public ResponseEntity createUser(@RequestParam String accessToken, @RequestParam String clientName) {
        // Create a new Okta client, assign it to the group(s) of the user which is requesting this

        // Can inspect the token here, extracting groups etc

        // Create the app

// POST to https://jpm-ms-dev.oktapreview.com/oauth2/v1/clients

//   {
//    "client_name": "{{providerName}}",
//    "response_types": [
//      "token"
//    ],
//    "grant_types": [
//      "client_credentials"
//    ],
//    "token_endpoint_auth_method": "client_secret_basic",
//    "application_type": "service"
//  }

        JSONObject requestPayloadJSON = new JSONObject();
        requestPayloadJSON.put("client_name", clientName);

        JSONArray requestResponseTypes = new JSONArray();
        requestResponseTypes.put("token");
        requestPayloadJSON.put("response_types", requestResponseTypes);

        JSONArray requestGrantTypes = new JSONArray();
        requestGrantTypes.put("client_credentials");
        requestPayloadJSON.put("grant_types", requestGrantTypes);

        requestPayloadJSON.put("token_endpoint_auth_method", "client_secret_basic");
        requestPayloadJSON.put("application_type", "service");

        String payloadString = requestPayloadJSON.toString();
        System.out.println("Syntesized payload: " + payloadString);

        WebClient client = WebClient.create();
        String remoteApiUrl = oktaOrgUrl + "/oauth2/v1/clients";
        String response = client.post()
                .uri(remoteApiUrl)
                .header(HttpHeaders.AUTHORIZATION, "SSWS " + oktaApiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(payloadString))
                .exchange()
                .block()
                .bodyToMono(String.class)
                .block();

        // and assign the app

        JSONObject jsonResponse = new JSONObject();
        jsonResponse.put( "remoteApiUrlQueried", remoteApiUrl );
        jsonResponse.put( "responseReceived", response );

        return ResponseEntity.ok(jsonResponse.toString());
    }

    private static PrivateKey deserializePrivateKey() throws NoSuchAlgorithmException, InvalidKeySpecException {
        // Testing full de-serialization of a key we serialized earlier
        String rsaPrivateKey = "-----BEGIN PRIVATE KEY-----\n" +
                "MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC3lztbD4NFSqya\n" +
                "QWbuITlD2BB4Nl6mPILbscGW4GeGfrus7mx1rO1anprBrpXsaJKMAAOeflNahDKB\n" +
                "0F25OiOqSj9nVqmeHNECj5vZ1boOBBquM2z5ryfxzc8rv4zpg0hOMyEojzSTve2H\n" +
                "nFxPb7b/9HZu6/EsFXJyiSlCXB2U89mNqSIXXQdUMNLPPEPFaLEaoi8EJZLD3pEy\n" +
                "rZJIbTGd0CBhZyg1i/dctLgGVDvCdq9CnoSq2zmS5PEbfFNGM343Es5Ckj4hbzD1\n" +
                "j/Bu3RMR1IhJjljz1anwgfyOMEeGJMhoalVVlaPYC57/+HQ5OHkyAivx3Ve0uNYq\n" +
                "QsQnbponAgMBAAECgf9n/ECiUycHGESrGmAygJ7uznKFpEX34k48IXKFApWgmCe0\n" +
                "y1ajUE8gBLWi/j/sp05Z/agPHX4YxsfUvzBWuZd53JQM9AkehTPdP3oG6Ad56Nkz\n" +
                "0eznf04gp3GwVc56dOF/aXZegr5E8E6ZgPbIB36feteZ/Amd7ofkV8wGyiX3NzCH\n" +
                "XXOhBbq/JHU+CW3KOoEulhvu6q3AqnlGitb+dfOppIX+/Sa61GKehclQHoINYoym\n" +
                "lkeMTwDJaRdb5lI8Ogja7HtvQQ0y/R7RgiuGoEk5itYypOwZkYic7cfcsFB1mlMn\n" +
                "YCURY0R9DKQItDruAO4JlH7MYRxJpXrjf5rfl1kCgYEA7Bb5ueqspY10jtQdAnbx\n" +
                "2m8pbKNfFXcpiLwSul8L+Pc8obEjyZK8wvYCSqXgqjNlSBrvq4vsWkIlrMlejNBf\n" +
                "vxZSWnGP5nN6RwTVX71QxXzlVJ7Fmlk0HMnO0CslOcSiZibPiNCYNVAy0Nhwh6PA\n" +
                "yLa0c4NiP79N2mzQ5bPN1C0CgYEAxxLWSGfhLvvtVrjsorc8DnEMjH6+WM6/OgBJ\n" +
                "bQig4CgsxC551zAVn04keEKaudzwj7Lq/7lCpOKODDsuOr8C8Gr6HnBfDn43cHXM\n" +
                "PadQm4cc/ykNYz+5Jm5FBCYv0XeA/9Ej+2fNK6jVC8zhf8S5QvJ1YwTFZ/6st7Sn\n" +
                "unwb+CMCgYEAyg7X6JC69m3cpilQMr3OPJ8LGxmv1VVJTOd6N9wFCS3AzLoo4Oof\n" +
                "d9TJHU5evAyE0HONUIrO3Gjkib9Glsn4SDk4foPXHusSahnu7KPAr2U3eXbxtCpI\n" +
                "eaMWx/9FOu3Z+Aebc4Lj4i0jcK7tkIlMA/yq8Hov6lM2tIyRNSbwMHkCgYB5ZlVi\n" +
                "5mZ+noeIIVG9kPyA2hQLAafWxI39MvuUEHT6/cT/BlCrF9m3wpGe/Q8aVVAmcbe5\n" +
                "pyKrJrX1Y4m3rZB/SN2q/mAZmIL6g/u/hW80yVq3iDNv2QZyF0DjXN5AYR474zCM\n" +
                "Oir2ewkhHxpNLozD9NP9RIWV+8scZID8yn7L/QKBgQCEJKTgOP4qrubar9gxxi8x\n" +
                "T/WBC+820ECtUbSzDG5abyDl7YsoDINu3CCtP+a7wBScxYsxkzGVZk3oHGNO9BLj\n" +
                "HcBf1R4wCw+PbGH0mtHIVnIVUz/8e/TUCeO19vGUnORjE0ifZrf3hSVReULBjcOw\n" +
                "sHCDDBwf0+xSL7LnOSdUSA==\n" +
                "-----END PRIVATE KEY-----";

        rsaPrivateKey = rsaPrivateKey.replace("-----BEGIN PRIVATE KEY-----", "");
        rsaPrivateKey = rsaPrivateKey.replace("\n", "");
        rsaPrivateKey = rsaPrivateKey.replace("-----END PRIVATE KEY-----", "");

        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(Base64.getDecoder().decode(rsaPrivateKey));
        KeyFactory kf = KeyFactory.getInstance("RSA");
        PrivateKey privKey = kf.generatePrivate(keySpec);
        return privKey;
    }

    @RequestMapping(path = "/crypto", method = RequestMethod.POST, produces = "application/json")
    public ResponseEntity cryptoTests(@RequestParam String accessToken, @RequestParam String clientName) {
        // Create a key pair
        KeyPair newKeyPair = Keys.keyPairFor(SignatureAlgorithm.RS256);
        PrivateKey newPrivateKey = newKeyPair.getPrivate();
        PublicKey newPublicKey = newKeyPair.getPublic();

        // See if we can serialize this private key into a PEM
        System.out.println( "Private key generated: \"" + newPrivateKey.toString() + "\"" );
        byte [] newPrivateKeyEncoded = newPrivateKey.getEncoded();
        byte [] newPrivateKeyBase64Encoded = Base64.getEncoder().encode(newPrivateKeyEncoded);
        String pemString = "";
        pemString += "-----BEGIN PRIVATE KEY-----\n";
        int numPrintedChars = 0;
        final String base64 = new String(newPrivateKeyBase64Encoded);
        System.out.println("base64: "+base64);
        final int lineWidth = 64;
        final int keyLength = base64.length();
        do {
            int numToPrintIntoThisLine = Math.min( keyLength - numPrintedChars, lineWidth );
            System.out.println("numToPrintIntoThisLine: "+numToPrintIntoThisLine);
            String thisLine = base64.substring(numPrintedChars, numPrintedChars + numToPrintIntoThisLine);
            System.out.println("thisLine: "+thisLine);
            pemString += thisLine + "\n";
            numPrintedChars += numToPrintIntoThisLine;
        } while (numPrintedChars < keyLength);
        pemString += "-----END PRIVATE KEY-----";
        System.out.println("Private Key in PEM format: " + pemString);
        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(Base64.getDecoder().decode(newPrivateKeyBase64Encoded));
        try {
            KeyFactory kf = KeyFactory.getInstance("RSA");
            PrivateKey privKey = kf.generatePrivate(keySpec);
            System.out.println("Private key re-serialized: " + privKey.toString());

            // Test the de-serialization of a key we printed earlier
            PrivateKey deserializedPrivateKey = deserializePrivateKey();
            System.out.println("Private key DE-serialized: " + deserializedPrivateKey.toString());
        }
        catch (Exception ex) {
            System.err.println("Exception occurred when generating private factory/key: " + ex.getMessage());
        }

        return ResponseEntity.ok("done");
    }

    @RequestMapping(path = "/clients/create_jwks", method = RequestMethod.POST, produces = "application/json")
    public ResponseEntity createClientJWKS(@RequestParam String accessToken, @RequestParam String clientName) {
        // Create a new Okta client, assign it to the group(s) of the user which is requesting this

        // Can inspect the token here, extracting groups etc

        // Create a key pair
//        KeyPair newKeyPair = Keys.keyPairFor(SignatureAlgorithm.RS256);
//        PrivateKey newPrivateKey = newKeyPair.getPrivate();
//        PublicKey newPublicKey = newKeyPair.getPublic();


        // Create the app

// POST to https://jpm-ms-dev.oktapreview.com/oauth2/v1/clients

        //   {
        //    "client_name": "{{providerName}}",
        //    "response_types": [
        //      "token"
        //    ],
        //    "grant_types": [
        //      "client_credentials"
        //    ],
        //    "token_endpoint_auth_method": "private_key_jwt",
        //    "application_type": "service",
        //    "jwks": {
        //      "keys": [
        // {"kty":"RSA","e":"AQAB","use":"sig","kid":"try1_mkjwk","alg":"RS256","n":"lSLQMWyVNGziCNbfXce2T13lUHFsZdVr6qPs2tHp-pDEXlCB29OEYuKlDhvWVDHUjFXpFFIcs5POIU9s-n8JwD50oKtpzyprMjGRLliY3N6EO2ojajJ1xorbrKxZ14CjDywkfBpzLYEzJbVWS9EQ08E4fgNdz9JOXCzaaQjj2H9zedikz32Ycw-A6hbELTkj_MqqoLnAos4X1QDobevPVdc_34lAoxwiTz2-lue1eyCkvyg4N5lRBYslTXvY2PnxzRU9lgWRhHevii8Jeif7WdDfBWpv4kjR_ko_180GzxTWoJDRRkrdBxS0FR2kY0KoCFUdJpjoAQYBN2oGn3llhQ"}
        //              ]
        //        }
        //  }

        String staticPubKeyN = "lSLQMWyVNGziCNbfXce2T13lUHFsZdVr6qPs2tHp-pDEXlCB29OEYuKlDhvWVDHUjFXpFFIcs5POIU9s-n8JwD50oKtpzyprMjGRLliY3N6EO2ojajJ1xorbrKxZ14CjDywkfBpzLYEzJbVWS9EQ08E4fgNdz9JOXCzaaQjj2H9zedikz32Ycw-A6hbELTkj_MqqoLnAos4X1QDobevPVdc_34lAoxwiTz2-lue1eyCkvyg4N5lRBYslTXvY2PnxzRU9lgWRhHevii8Jeif7WdDfBWpv4kjR_ko_180GzxTWoJDRRkrdBxS0FR2kY0KoCFUdJpjoAQYBN2oGn3llhQ";

        JSONObject requestPayloadJSON = new JSONObject();
        requestPayloadJSON.put("client_name", clientName);

        JSONArray requestResponseTypes = new JSONArray();
        requestResponseTypes.put("token");
        requestPayloadJSON.put("response_types", requestResponseTypes);

        JSONArray requestGrantTypes = new JSONArray();
        requestGrantTypes.put("client_credentials");
        requestPayloadJSON.put("grant_types", requestGrantTypes);

        requestPayloadJSON.put("token_endpoint_auth_method", "private_key_jwt"); // This changed
        requestPayloadJSON.put("application_type", "service");

        JSONArray requestKeys = new JSONArray();
        JSONObject firstKey = new JSONObject();
        firstKey.put("kty", "RSA");
        firstKey.put("e", "AQAB");
        firstKey.put("use", "sig");
        firstKey.put("kid", "try1_mkjwk");
        firstKey.put("alg", "RS256");
        firstKey.put("n", staticPubKeyN);
        requestKeys.put(firstKey);

        JSONObject requestJwks = new JSONObject();
        requestJwks.put("keys", requestKeys);
        requestPayloadJSON.put("jwks", requestJwks);

        String payloadString = requestPayloadJSON.toString();
        System.out.println("Syntesized payload: " + payloadString);

        WebClient client = WebClient.create();
        String remoteApiUrl = oktaOrgUrl + "/oauth2/v1/clients";
        String response = client.post()
                .uri(remoteApiUrl)
                .header(HttpHeaders.AUTHORIZATION, "SSWS " + oktaApiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(payloadString))
                .exchange()
                .block()
                .bodyToMono(String.class)
                .block();

        // and assign the app

        JSONObject jsonResponse = new JSONObject();
        jsonResponse.put( "remoteApiUrlQueried", remoteApiUrl );
        jsonResponse.put( "responseReceived", response );

        return ResponseEntity.ok(jsonResponse.toString());
    }
}
