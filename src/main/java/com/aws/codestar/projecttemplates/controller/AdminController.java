package com.aws.codestar.projecttemplates.controller;

import com.okta.sdk.client.Client;
import com.okta.sdk.resource.application.ApplicationList;
import com.okta.sdk.resource.user.UserList;
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

    @RequestMapping(path = "/clients/create_jwks", method = RequestMethod.POST, produces = "application/json")
    public ResponseEntity createClientJWKS(@RequestParam String accessToken, @RequestParam String clientName) {
        // Create a new Okta client, assign it to the group(s) of the user which is requesting this

        // Can inspect the token here, extracting groups etc

        // Create a key pair

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
