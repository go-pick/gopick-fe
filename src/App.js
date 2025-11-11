import MainPage from './features/main/MainPage';
import { darkTheme, lightTheme } from './styles/theme';
import GlobalStyle from './styles/GlobalStyle';
import { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import Footer from './components/layout/footer/Footer';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/layout/navbar/NavBar';
import LoginPage from './features/auth/LoginPage';
import ScrollToTop from './components/utils/ScrollToTop';
import SignupPage from './features/auth/SignupPage';
import VerifyEmailPage from './features/auth/VerifyEmailPage';
import { AuthProvider } from './contexts/AuthContext';
import { CustomThemeProvider, useTheme } from './contexts/ThemeContext';
import ProtectedRoute from './routes/ProtectedRoute';
import MyPageLayout from './features/mypage/MyPageLayout';
import HistoryPage from './features/mypage/pages/HistoryPage';
import ChangePasswordPage from './features/mypage/pages/ChangePasswordPage';
import ChangeEmailPage from './features/mypage/pages/ChangeEmailPage';

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
							
							<Route
								path='/mypage'
								element={
									<ProtectedRoute>
										<MyPageLayout />
									</ProtectedRoute>
								}
							>
								<Route index element={<Navigate to="/mypage/history" replace />} />
								<Route path='history' element={<HistoryPage />} />
								<Route path='password' element={<ChangePasswordPage />} />
								<Route path='email' element={<ChangeEmailPage />} />
								

							</Route>
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
