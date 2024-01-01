package app.ishiko.api.auth;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.User.UserBuilder;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.View;

@Controller
@RequestMapping("/auth")
public class AuthController {
    UserDetailsManager userDetailsManager;

    public AuthController(UserDetailsManager userDetailsManager) {
        this.userDetailsManager = userDetailsManager;
    }

    @GetMapping("signup")
    public String signUpPage(HttpServletRequest request, Model model) {
        CsrfToken csrfToken = (CsrfToken) request.getAttribute("_csrf");
        model.addAttribute("_csrfToken", csrfToken.getToken());
        return "auth/signup";
    }

    @GetMapping("signin")
    public String signInPage(HttpServletRequest request, Model model) {
        CsrfToken csrfToken = (CsrfToken) request.getAttribute("_csrf");
        model.addAttribute("_csrfToken", csrfToken.getToken());
        return "auth/signin";
    }

    @PostMapping("signup")
    public ModelAndView signUp(HttpServletRequest request, SignUpDto signUpDto) {
        System.out.println(signUpDto.toString());
        UserBuilder user = User.builder();

        // create user
        request.setAttribute(View.RESPONSE_STATUS_ATTRIBUTE, HttpStatus.FOUND);
        return new ModelAndView("redirect:http://localhost:3000");
    }
}
