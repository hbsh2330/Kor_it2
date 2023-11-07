package com.yhp.studybbs.controllers;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping(value = "user")
public class UserController {
    @RequestMapping(value = "login", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getLogin() {
        return new ModelAndView("user/login");
    }

    @RequestMapping(value = "register", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getRegister() {
        return new ModelAndView("user/register");
    }

    @ResponseBody
    @RequestMapping(value = "registerEmail", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public String getRegisterEmail(
            @RequestParam(value = "email") String email){
        return null;
    }
}