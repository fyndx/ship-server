// CORS configuration
const CORS_CONFIG = {
	allowedOrigins: ["http://localhost:8081", "http://localhost:3000"],
	allowedPatterns: [/^https:\/\/[a-zA-Z0-9-]+\.expo\.app$/],
};

export const isOriginAllowed = (origin: string): boolean => {
	// Check static origins
	if (CORS_CONFIG.allowedOrigins.includes(origin)) {
		return true;
	}

	// Check pattern-based origins
	return CORS_CONFIG.allowedPatterns.some((pattern) => pattern.test(origin));
};
