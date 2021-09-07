package com.aws.codestar.projecttemplates.controller;

import org.json.JSONObject;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Collections;

/**
 * Basic Spring web service controller that handles all GET requests.
 */
@RestController
@RequestMapping("/api/")
public class HelloWorldController {

    private static final String MESSAGE_FORMAT = "Hello %s!";

    @RequestMapping(method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity helloWorldGet(@RequestParam(value = "name", defaultValue = "World") String name) {
        return ResponseEntity.ok(createResponse(name));
    }

    @RequestMapping(method = RequestMethod.POST, produces = "application/json")
    public ResponseEntity helloWorldPost(@RequestParam(value = "name", defaultValue = "World") String name) {
        return ResponseEntity.ok(createResponse(name));
    }

    @RequestMapping(path = "ext/", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity externalAPIGetAuthenticated(@RequestParam String accessToken) {
        WebClient client = WebClient.create();
        String response = client.get()
//              .uri("http://localhost:8081/")
              .uri("https://api.unicorn-finance-protected.com/")
              .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
              .exchange()
              .block()
              .bodyToMono(String.class)
              .block();

        return ResponseEntity.ok(createResponse(response));
    }

    @RequestMapping(path = "ext_protected/", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity externalProtectedAPIGetAuthenticated(@RequestParam String accessToken) {
        WebClient client = WebClient.create();
        String response = client.get()
//                .uri("http://localhost:8081/restricted")
                .uri("https://api.unicorn-finance-protected.com/restricted")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .exchange()
                .block()
                .bodyToMono(String.class)
                .block();

        return ResponseEntity.ok(createResponse(response));
    }

    private String createResponse(String name) {
        return new JSONObject().put("Output", String.format(MESSAGE_FORMAT, name)).toString();
    }
}