import type { RequestMiddleware } from "@/lib/middleware";
import type { NextRequest } from "next/server";
import type { OAuth2Provider } from "../oauth2/providers/OAuth2Provider";
import type { SessionManager } from "../session/SessionManager";
import { NextResponse } from "next/server";
import { OAuth2TokenSet, OidcTokenSet } from "../oauth2";
import { User } from "../user";
import { Session } from "../session/types";

export class OidcAuthorizationCodeMiddleware implements RequestMiddleware {
    path = ["/oauth2/code"];
    provider: OAuth2Provider;
    sessions: SessionManager;

    constructor(provider: OAuth2Provider, sessions: SessionManager) {
        this.provider = provider;
        this.sessions = sessions;
    }

    handleRequest = async (request: NextRequest) => {
        if (request.method !== "GET") return;
        const url = new URL(request.url);
        const storedState = request.cookies.get("state")?.value;
        const state = url.searchParams.get("state");
        const code = url.searchParams.get("code");
        const errorResponse = NextResponse.redirect(
            "http://localhost:3000/error",
        );
        const { providerId } = this.provider.config;
        let tokenSet: OidcTokenSet;
        let providerUserId: string;
        let user: User | null;
        let session: Session;

        if (!storedState || !state || storedState !== state || !code) {
            return NextResponse.redirect("error_url");
        }

        try {
            tokenSet = await this.provider.exchangeCode(code);
        } catch (e) {
            return errorResponse;
        }

        providerUserId = tokenSet.idToken.claims.sub;

        try {
            user = await this.provider.getUserByOAuth2Key(
                providerId,
                providerUserId,
            );
        } catch (e) {
            return errorResponse;
        }

        if (!user) {
            try {
                user = await this.provider.createUserWithOAuth2Key(
                    providerId,
                    providerUserId,
                    this.provider.config.getUserDetailsFromIdToken(
                        tokenSet.idToken.claims,
                    ),
                );
            } catch (e) {
                return errorResponse;
            }
        }

        try {
            await this.provider.createTokenSet(
                tokenSet,
                providerId,
                providerUserId,
            );
        } catch (e) {
            return errorResponse;
        }

        try {
            session = await this.sessions.createSession(user.id, {});
        } catch (e) {
            return errorResponse;
        }

        const response = NextResponse.redirect("http://localhost:3000/");
        this.sessions.setSessionCookie(response, session);
        return response;
    };
}
