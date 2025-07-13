const BASE_URL = "http://localhost:4000/api";

async function fetchInstance(endpoint, options = {}) {
	const headers = {
		"Content-Type": "application/json",
		...options.headers,
	};

	const config = {
		...options,
		headers,
		// The browser will automatically send cookies for the domain.
		credentials: "include",
	};

	if (options.body) {
		config.body = JSON.stringify(options.body);
	}

	const response = await fetch(`${BASE_URL}${endpoint}`, config);

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({
			message: "An unknown error occurred",
		}));
		throw new Error(errorData.message || "Request failed");
	}

	const contentType = response.headers.get("content-type");
	if (contentType && contentType.includes("application/json")) {
		return response.json();
	}

	// Return null for non-JSON responses
	return null;
}

export default fetchInstance;
