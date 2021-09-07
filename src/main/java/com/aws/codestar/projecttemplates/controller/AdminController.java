package com.aws.codestar.projecttemplates.controller;

import com.okta.sdk.client.Client;
import com.okta.sdk.resource.user.UserList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdminController {
    @Autowired
    public Client oktaClient;

    @GetMapping("/users")
    public UserList getUsers() {
        return oktaClient.listUsers();
    }
}
