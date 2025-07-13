import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
	// Get the stored theme from localStorage or default to 'light'
	const defaultTheme = "cupcake";
	const [theme, setTheme] = useState(
		localStorage.getItem("theme") || defaultTheme
	);

	useEffect(() => {
		// Set the data-theme attribute on the <html> element
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem("theme", theme);
	}, [theme]);

	const toggleTheme = () => {
		setTheme((prevTheme) =>
			prevTheme === defaultTheme ? "forest" : defaultTheme
		);
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};
