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
import { AuthProvider } from './contexts/AuthContext';
import { CustomThemeProvider, useTheme } from './contexts/ThemeContext';

function AppContent() {
	const { themeMode } = useTheme();
	const currentTheme = themeMode === 'light' ? lightTheme : darkTheme;
	
	return (
		<ThemeProvider theme={currentTheme}>
			<GlobalStyle />
			<BrowserRouter>
				<AuthProvider>
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
				</AuthProvider>
			</BrowserRouter>
		</ThemeProvider>
	);
};

function App() {
	
	return (
		<CustomThemeProvider>
			<AppContent />
		</CustomThemeProvider>
	)
}

export default App;
