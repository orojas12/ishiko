import type { RequestMiddleware } from "@/lib/middleware";
import type { NextRequest } from "next/server";
import type { OAuth2Provider } from "../oauth2/providers/OAuth2Provider";
import { NextResponse } from "next/server";

export class OAuth2AuthorizationCodeMiddleware implements RequestMiddleware {
    path = ["/oauth2/code"];
    provider: OAuth2Provider;

    constructor(provider: OAuth2Provider) {
        this.provider = provider;
    }

    handleRequest = async (request: NextRequest) => {
        if (request.method !== "GET") return;
        const url = new URL(request.url);
        const storedState = request.cookies.get("state")?.value;
        const state = url.searchParams.get("state");
        const code = url.searchParams.get("code");

        if (!storedState || !state || storedState !== state || !code) {
            return NextResponse.redirect("error_url");
        }

        try {
            const tokenSet = await this.provider.exchangeCode(code);
            let user = await this.provider.getUserByOAuth2Key(
                this.provider.config.providerId,
                tokenSet.idToken.claims.sub,
            );
            if (!user) {
                user = await this.provider.createUserWithOAuth2Key(
                    this.provider.config.providerId,
                    tokenSet.idToken.claims.sub,
                    this.provider.config.getUserDetailsFromIdToken(
                        tokenSet.idToken.claims,
                    ),
                );
            }
            // save tokens
            // create session
            // set session cookie
        } catch (error) {}
    };
}
