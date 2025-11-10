import MainPage from './features/main/MainPage';
import { darkTheme, lightTheme } from './styles/theme';
import GlobalStyle from './styles/GlobalStyle';
import { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import Footer from './components/layout/footer/Footer';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './components/layout/navbar/NavBar';
import LoginPage from './features/auth/LoginPage';
import ScrollToTop from './components/utils/ScrollToTop';
import SignupPage from './features/auth/SignupPage';
import VerifyEmailPage from './features/auth/VerifyEmailPage';

function App() {
	const [themeMode, setThemeMode] = useState('light');
	const currentTheme = themeMode === 'light' ? lightTheme : darkTheme;

	const toggleTheme = () => {
		setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
	};

	return (
		<ThemeProvider theme={currentTheme}>
			<GlobalStyle />
			<BrowserRouter>
				<ScrollToTop />
				<NavBar />
				<main>
					<Routes>
						<Route path='/' element={<MainPage />} />
						<Route path='/login' element={<LoginPage />} />
						<Route path='/signup' element={<SignupPage />} />

						<Route path="/verify-email" element={<VerifyEmailPage />} />
					</Routes>
				</main>
				<Footer />
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
