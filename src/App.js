import MainPage from './features/main/MainPage';
import { darkTheme, lightTheme } from './styles/theme';
import GlobalStyle from './styles/GlobalStyle';
import { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import Footer from './components/footer/Footer';

function App() {
	const [themeMode, setThemeMode] = useState('dark');
	const currentTheme = themeMode === 'light' ? lightTheme : darkTheme;

	const toggleTheme = () => {
		setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
	}

	return (
		<ThemeProvider theme={currentTheme}>
			<GlobalStyle />
			<MainPage />
			<Footer />
		</ThemeProvider>
	);
}

export default App;
