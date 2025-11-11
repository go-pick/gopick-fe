import { createContext, useContext, useEffect, useState } from "react";

const THEME_STORAGE_KEY = 'goPick-themeMode';

const ThemeContext = createContext();

const CustomThemeProvider = ({ children }) => {
	const [themeMode, setThemeMode] = useState(() => {
		// 로컬 스토리지에서 'goPick_themeMode' 키로 값을 가져옵니다.
		const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
		return savedTheme || 'dark';
	});
	
	useEffect(() => {
		// 'goPick_themeMode' 키로 현재 themeMode 값을 저장합니다.
		localStorage.setItem(THEME_STORAGE_KEY, themeMode);
	}, [themeMode]);
	
	const toggleTheme = () => {
		setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
	};
	
	const value = { themeMode, toggleTheme };

	return (
		<ThemeContext.Provider value={value}>
			{children}
		</ThemeContext.Provider>
	);
};

const useTheme = () => {
	return useContext(ThemeContext);
};

export { CustomThemeProvider, useTheme };