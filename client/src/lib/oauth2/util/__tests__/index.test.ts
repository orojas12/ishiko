import { describe, expect, test } from "vitest";
import { decodeJwt, generateRandomString } from "..";

describe("decodeJwt()", () => {
    test("returns decoded jwt payload", () => {
        const expectedData = {
            sub: "1234567890",
            name: "John Doe",
            iat: 1516239022,
        };
        const jwt =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
        const payload = decodeJwt(jwt);
        expect(payload.sub).toEqual(expectedData.sub);
        expect(payload.name).toEqual(expectedData.name);
        expect(payload.iat).toEqual(expectedData.iat);
    });
});

describe("generateRandomString()", () => {
    test("returns string of correct length", () => {
        const lengthsList = [5, 3, 15, 100, 30];
        lengthsList.forEach((length) => {
            const result = generateRandomString(length);
            expect(result.length).toEqual(length);
        });
    });

    test("uses specified characters only", () => {
        const charactersList = ["abcefg", "0123456789", "a", "ABCDEFG"];
        charactersList.forEach((characters) => {
            const result = generateRandomString(5, characters);
            expect(result.length).toEqual(5);
            result.split("").forEach((char) => {
                expect(characters.includes(char)).toEqual(true);
            });
        });
    });
});
