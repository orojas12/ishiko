package app.ishiko.api.auth;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import app.ishiko.api.exception.InvalidInputException;

@Controller
@RequestMapping("/auth")
public class AuthController {
    private String baseUrl;
    private AuthService auth;

    public AuthController(@Value("${ishiko.base_url}") String baseUrl,
            AuthService auth) {
        this.baseUrl = baseUrl;
        this.auth = auth;
    }

    @GetMapping("/signup")
    public String signUpPage(HttpServletRequest request, Model model,
            @RequestParam(defaultValue = "") String error) {
        CsrfToken csrfToken = (CsrfToken) request.getAttribute("_csrf");
        model.addAttribute("csrfToken", csrfToken.getToken());
        model.addAttribute("error", error);
        return "auth/signup";
    }

    @GetMapping("/signin")
    public String signInPage(HttpServletRequest request, Model model,
            @RequestParam(defaultValue = "") String error) {
        CsrfToken csrfToken = (CsrfToken) request.getAttribute("_csrf");
        model.addAttribute("csrfToken", csrfToken.getToken());
        model.addAttribute("error", error);
        return "auth/signin";
    }

    @PostMapping("/signup")
    public String signUp(HttpServletRequest request, SignUpDto signUpDto,
            Model model) {
        CsrfToken csrfToken = (CsrfToken) request.getAttribute("_csrf");
        try {
            auth.signUpUser(signUpDto);
        } catch (InvalidInputException e) {
            model.addAttribute("csrfToken", csrfToken.getToken());
            model.addAttribute("error", e.getMessage());
            return "auth/signup";
        }
        model.addAttribute("loginUrl", baseUrl + "/oidc/login");
        return "auth/account-created";
    }
}
