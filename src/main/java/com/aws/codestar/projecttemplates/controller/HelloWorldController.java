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

    private ResponseEntity queryHost( String gateway, String endpoint, String accessToken ) {
        WebClient client = WebClient.create();
        String remoteApiUrl = gateway + endpoint;
        String authHeader = "Bearer " + accessToken;
        String response = client.get()
                .uri(remoteApiUrl)
                .header(HttpHeaders.AUTHORIZATION, authHeader)
                .exchange()
                .block()
                .bodyToMono(String.class)
                .block();

//        System.out.println("Querying remote API: " + remoteApiUrl);
//        System.out.println("Auth header: " + authHeader);

        JSONObject jsonResponse = new JSONObject();
        jsonResponse.put( "remoteApiUrlQueried", remoteApiUrl );
        jsonResponse.put( "responseReceived", response );

        return ResponseEntity.ok(jsonResponse.toString());
    }

    @RequestMapping(path = "test_api_gw/", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity testApiGateway(@RequestParam String accessToken) {
        return queryHost(
                "https://tntr978g25.execute-api.us-west-2.amazonaws.com",
                "/api/duckssay",
                accessToken
        );
    }

    @RequestMapping(path = "test_api_gw_ireland/", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity testApiGatewayIreland(@RequestParam String accessToken) {
        return queryHost(
                "https://evmv7npsa2.execute-api.eu-west-1.amazonaws.com",
                "/",
                accessToken
        );
    }

    @RequestMapping(path = "test_api_gw_ireland_protected/", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity testApiGatewayIrelandProtected(@RequestParam String accessToken) {
        return queryHost(
                "https://evmv7npsa2.execute-api.eu-west-1.amazonaws.com",
                "/api/protected",
                accessToken
        );
    }

    @RequestMapping(path = "test_api_gw_ireland_admin/", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity testApiGatewayIrelandAdmin(@RequestParam String accessToken) {
        return queryHost(
                "https://evmv7npsa2.execute-api.eu-west-1.amazonaws.com",
                "/api/admin",
                accessToken
        );
    }

    @RequestMapping(path = "ext/", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity externalAPIGetAuthenticated(@RequestParam String accessToken, @RequestParam String runtimeHostname) {
        return queryHost(
                remoteApiUrlForEnvironment(runtimeHostname),
                "",
                accessToken
        );
    }

    @RequestMapping(path = "ext_admin/", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity externalAdminAPIGetAuthenticated(@RequestParam String accessToken, @RequestParam String runtimeHostname) {
        return queryHost(
                remoteApiUrlForEnvironment(runtimeHostname),
                "/admin",
                accessToken
        );
    }

    @RequestMapping(path = "ext_protected/", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity externalProtectedAPIGetAuthenticated(@RequestParam String accessToken, @RequestParam String runtimeHostname) {
        return queryHost(
                remoteApiUrlForEnvironment(runtimeHostname),
                "/restricted",
                accessToken
        );
    }

    private String remoteApiUrlForEnvironment(String runtimeHostname) {
        String remoteApiUrl = "internal-uf-behind-apigw-lb-680393014.eu-west-1.elb.amazonaws.com"; // this is only reachable from inside the AWS VPC
        if (runtimeHostname.equals("localhost")) {
//            remoteApiUrl = "http://localhost:8081"; // OAuth2 app running locally
            remoteApiUrl = "http://54.247.156.88"; // Directly to the remote server
        }

        return remoteApiUrl;
    }

    private String createResponse(String name) {
        return new JSONObject().put("Output", String.format(MESSAGE_FORMAT, name)).toString();
    }
}