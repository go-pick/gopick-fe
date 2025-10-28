import MainPage from './features/main/MainPage';
import { darkTheme, lightTheme } from './styles/theme';
import GlobalStyle from './styles/GlobalStyle';
import { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import Footer from './features/layout/Footer';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './features/layout/NavBar';

function App() {
	const [themeMode, setThemeMode] = useState('dark');
	const currentTheme = themeMode === 'light' ? lightTheme : darkTheme;

	const toggleTheme = () => {
		setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
	}

	return (
		<ThemeProvider theme={currentTheme}>
			<GlobalStyle />
			<NavBar />
			<main>
				<Routes>
					<Route path='/' element={<MainPage />} />
				</Routes>
			</main>
			<Footer />
		</ThemeProvider>
	);
}

export default App;
