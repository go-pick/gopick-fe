import MainPage from './features/main/MainPage';
import { darkTheme, lightTheme } from './styles/theme';
import GlobalStyle from './styles/GlobalStyle';
import { ThemeProvider } from 'styled-components';
import Footer from './components/layout/footer/Footer';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/layout/navbar/NavBar';
import LoginPage from './features/auth/LoginPage';
import ScrollToTop from './utils/ScrollToTop';
import SignupPage from './features/auth/SignupPage';
import VerifyEmailPage from './features/auth/VerifyEmailPage';
import { AuthProvider } from './contexts/AuthContext';
import { CustomThemeProvider, useTheme } from './contexts/ThemeContext';
import ProtectedRoute from './routes/ProtectedRoute';
import MyPageLayout from './features/mypage/MyPageLayout';
import HistoryPage from './features/mypage/pages/HistoryPage';
import ChangePasswordPage from './features/mypage/pages/ChangePasswordPage';
import ChangeEmailPage from './features/mypage/pages/ChangeEmailPage';
import PasswordUpdatePage from './features/mypage/pages/PasswordUpdatePage';
import ComparePage from './features/compare/ComparePage';
import CompareResultPage from './features/compare/CompareResultPage';
import HistoryDetailPage from './features/mypage/pages/HistoryDetailPage';

function AppContent() {
	const { themeMode } = useTheme();
	const currentTheme = themeMode === 'light' ? lightTheme : darkTheme;
	
	return (
		<ThemeProvider theme={currentTheme}>
			<GlobalStyle />
			<BrowserRouter basename={process.env.PUBLIC_URL}>
				<AuthProvider>
					<ScrollToTop />
					<NavBar />
					<main>
						<Routes>
							<Route path='/' element={<MainPage />} />
							<Route path='/login' element={<LoginPage />} />
							<Route path='/signup' element={<SignupPage />} />
							<Route path='/compare' element={<ComparePage />} />
							<Route path='/compare/result' element={<CompareResultPage />} />
							
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
								<Route path="history/:id" element={<HistoryDetailPage />} />
								<Route path='password' element={<ChangePasswordPage />} />
								<Route path='email' element={<ChangeEmailPage />} />
								<Route path="update-password" element={<PasswordUpdatePage />} />

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
