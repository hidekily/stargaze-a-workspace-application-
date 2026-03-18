export declare const auth: import("better-auth").Auth<{
    database: (options: import("better-auth").BetterAuthOptions) => import("better-auth").DBAdapter<import("better-auth").BetterAuthOptions>;
    trustedOrigins: string[];
    baseURL: string;
    account: {
        accountLinking: {
            enabled: true;
            trustedProviders: ("github" | "figma" | "google")[];
        };
    };
    advanced: {
        crossSubDomainCookies: {
            enabled: false;
        };
        defaultCookieAttributes: {
            secure: true;
        };
    };
    socialProviders: {
        google: {
            prompt: "select_account";
            clientId: string;
            clientSecret: string;
        };
        github: {
            clientId: string;
            clientSecret: string;
        };
        figma: {
            clientId: string;
            clientSecret: string;
        };
    };
}>;
