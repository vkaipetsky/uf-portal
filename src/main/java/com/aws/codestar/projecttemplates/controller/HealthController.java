package com.aws.codestar.projecttemplates.controller;

import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/health")
public class HealthController {
    @RequestMapping(method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity health() {
        return ResponseEntity.ok(new JSONObject().put("status", "up").toString());
    }
}
