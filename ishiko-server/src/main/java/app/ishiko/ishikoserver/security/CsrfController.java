package app.ishiko.ishikoserver.security;

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/csrf")
public class CsrfController {

    @PostMapping
    public CsrfToken getCsrf(CsrfToken csrfToken) {
        return csrfToken;
    }
}
