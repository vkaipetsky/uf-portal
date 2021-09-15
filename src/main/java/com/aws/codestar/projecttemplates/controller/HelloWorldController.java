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

    @RequestMapping(path = "test_api_gw/", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity testApiGatewayAuthenticated(@RequestParam String accessToken) {
        WebClient client = WebClient.create();
        String response = client.get()
                .uri("https://tntr978g25.execute-api.us-west-2.amazonaws.com/api/duckssay")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .exchange()
                .block()
                .bodyToMono(String.class)
                .block();

        return ResponseEntity.ok(response);
    }

    @RequestMapping(path = "ext/", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity externalAPIGetAuthenticated(@RequestParam String accessToken, @RequestParam String runtimeHostname) {
        WebClient client = WebClient.create();
        String remoteApiUrl = remoteApiUrlForEnvironment(runtimeHostname);
        String response = client.get()
              .uri(remoteApiUrl)
              .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
              .exchange()
              .block()
              .bodyToMono(String.class)
              .block();

        JSONObject jsonResponse = new JSONObject(response);
        jsonResponse.put( "remoteApiUrl", remoteApiUrl );

        return ResponseEntity.ok(jsonResponse.toString());
    }

    @RequestMapping(path = "ext_protected/", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity externalProtectedAPIGetAuthenticated(@RequestParam String accessToken, @RequestParam String runtimeHostname) {
        WebClient client = WebClient.create();
        String remoteApiUrl = remoteApiUrlForEnvironment(runtimeHostname) + "/restricted";
        String response = client.get()
                .uri(remoteApiUrl)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .exchange()
                .block()
                .bodyToMono(String.class)
                .block();

        JSONObject jsonResponse = new JSONObject(response);
        jsonResponse.put( "remoteApiUrl", remoteApiUrl );

        return ResponseEntity.ok(jsonResponse.toString());
    }

    private String remoteApiUrlForEnvironment(String runtimeHostname) {
        String remoteApiUrl = "internal-uf-oauth2-internal-LB-1093192754.eu-west-1.elb.amazonaws.com"; // this is only reachable from inside the AWS VPC
        if (runtimeHostname.equals("localhost")) {
            remoteApiUrl = "http://localhost:8081";
        }

        return remoteApiUrl;
    }

    private String createResponse(String name) {
        return new JSONObject().put("Output", String.format(MESSAGE_FORMAT, name)).toString();
    }
}