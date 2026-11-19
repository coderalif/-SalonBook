// ========================================================
// Official Google Identity Services (GIS) OAuth Helper
// Google Cloud OAuth 2.0 Integration
// ========================================================

export interface GoogleUserProfile {
    name: string;
    email: string;
    picture?: string;
}

/**
 * Triggers official Google OAuth 2.0 Identity Services popup
 * and fetches the verified user profile information.
 */
export const requestGoogleLogin = (): Promise<GoogleUserProfile> => {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined') {
            return reject(new Error('Browser window environment is not available.'));
        }

        const clientId =
            process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
            '299610781439-9o99fcrg37ej9e1vvdnmmfn1retko186.apps.googleusercontent.com';

        const google = (window as any).google;

        if (!google || !google.accounts || !google.accounts.oauth2) {
            return reject(
                new Error(
                    'Google Identity Services is initializing. Please wait a moment and try again.'
                )
            );
        }

        try {
            const tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: clientId,
                scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid',
                prompt: 'select_account',
                callback: async (tokenResponse: any) => {
                    if (tokenResponse.error) {
                        return reject(new Error(tokenResponse.error_description || tokenResponse.error));
                    }

                    if (!tokenResponse.access_token) {
                        return reject(new Error('Did not receive access token from Google.'));
                    }

                    try {
                        // Google OAuth2 UserInfo API call
                        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                            headers: {
                                Authorization: `Bearer ${tokenResponse.access_token}`,
                            },
                        });

                        if (!response.ok) {
                            throw new Error('Failed to fetch user details from Google.');
                        }

                        const profile = await response.json();

                        resolve({
                            name: profile.name || profile.given_name || (profile.email ? profile.email.split('@')[0] : 'Google User'),
                            email: profile.email,
                            picture: profile.picture,
                        });
                    } catch (fetchErr: any) {
                        reject(fetchErr);
                    }
                },
                error_callback: (err: any) => {
                    reject(new Error(err?.message || 'Google OAuth prompt was cancelled or closed.'));
                },
            });

            tokenClient.requestAccessToken();
        } catch (err: any) {
            reject(err);
        }
    });
};
