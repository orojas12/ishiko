import { decodeJwt } from "..";

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
