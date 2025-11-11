import { createContext, useContext, useEffect, useState } from "react";

const THEME_STORAGE_KEY = 'goPick-themeMode';

const ThemeContext = createContext();

const CustomThemeProvider = ({ children }) => {
	const [themeMode, setThemeMode] = useState(() => {
		// 로컬 스토리지에 기존 값이 있는지 확인
		const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
		return savedTheme || 'light';
	});
	
	useEffect(() => {
		// 'goPick_themeMode' 키로 현재 themeMode 값을 저장.
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