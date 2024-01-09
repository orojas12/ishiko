const form = document.getElementById("signup-form");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const confirmPasswordError = document.getElementById("confirm-password-error");

const validatePasswords = (e) => {
    if (password.value !== confirmPassword.value) {
        confirmPasswordError.innerText = "Both passwords do not match";
        confirmPassword.classList.add("input--error");
        confirmPassword.focus();
        e.preventDefault();
    }
}

const resetErrorStyles = (e) => {
    confirmPassword.classList.remove("input--error");
    confirmPasswordError.innerText = "";
}

form.addEventListener("submit", validatePasswords);
confirmPassword.addEventListener("input", resetErrorStyles);