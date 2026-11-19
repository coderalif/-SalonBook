// ========================================================
// Official Google Identity Services (GIS) OAuth Helper
// ========================================================

export interface GoogleUserProfile {
    name: string;
    email: string;
    picture?: string;
}

/**
 * Ensures Google Identity Services script (gsi/client) is loaded
 */
export const loadGoogleScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined') {
            return resolve();
        }

        if ((window as any).google?.accounts?.oauth2) {
            return resolve();
        }

        const existingScript = document.getElementById('google-gsi-client');
        if (existingScript) {
            if ((window as any).google?.accounts?.oauth2) {
                return resolve();
            }
            existingScript.addEventListener('load', () => resolve());
            existingScript.addEventListener('error', () => reject(new Error('Failed to load Google SDK')));
            return;
        }

        const script = document.createElement('script');
        script.id = 'google-gsi-client';
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Could not connect to Google services. Please check your internet connection.'));
        document.body.appendChild(script);
    });
};

/**
 * Triggers official Google OAuth 2.0 popup
 */
export const requestGoogleLogin = async (): Promise<GoogleUserProfile> => {
    await loadGoogleScript();

    return new Promise((resolve, reject) => {
        const clientId =
            process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
            '299610781439-9o99fcrg37ej9e1vvdnmmfn1retko186.apps.googleusercontent.com';

        const google = (window as any).google;

        if (!google || !google.accounts || !google.accounts.oauth2) {
            return reject(new Error('Google Identity Services could not be loaded. Please refresh the page.'));
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
                        return reject(new Error('No access token received from Google.'));
                    }

                    try {
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
                    reject(new Error(err?.message || 'Google Sign-In popup was closed.'));
                },
            });

            tokenClient.requestAccessToken();
        } catch (err: any) {
            reject(err);
        }
    });
};
