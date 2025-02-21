import { createContext, useState, useContext, useEffect } from "react";

// Create Theme Context
export const ThemeContext = createContext();

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
    // Get stored theme from localStorage or default to "light"
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    // Function to toggle theme
    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme); // Save theme to localStorage
        document.documentElement.setAttribute("data-theme", newTheme); // Apply to <html> tag
    };

    // Apply theme when component mounts or theme changes
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook to use the theme
export const useTheme = () => useContext(ThemeContext);
