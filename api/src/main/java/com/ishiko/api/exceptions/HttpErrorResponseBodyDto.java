package com.ishiko.api.exceptions;

public class HttpErrorResponseBodyDto {
    private String message;

    public HttpErrorResponseBodyDto(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

}
