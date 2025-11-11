import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [session, setSession] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	// 앱 로드 시 Supabase에 현재 세션 정보를 요청.
	useEffect(() => {
		const fetchSession = async () => {
			const { data: {session} } = await supabase.auth.getSession();
			setSession(session);
			setLoading(false);
		};

		fetchSession();

		// Auth 상태 변경 리스너
		// 로그인, 로그아웃, 토큰 갱신 등 자동 감지.
		const { data: {subscription} } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				setSession(session);
				if (session) {
					localStorage.setItem('supabaseSession', JSON.stringify(session));
				} else {
					localStorage.removeItem('supabaseSession');
				}
			}
		);

		// 컴포넌트 언마운트 시 리스너 해제
		return () => {
			subscription.unsubscribe();
		};
	}, []);

	// 로그아웃 기능 (세션 삭제)
	const logout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error('error :', error);
		} else {
			setSession(null);
			localStorage.removeItem('supabaseSession');
			alert('로그아웃 되었습니다.');
			navigate('/');
		}
	};

	// Context로 제공할 값
	const value = {
		session,
		isLoggedIn: !!session,
		logout,
		isLoading: loading,
	};

	if (loading) {
		return <div>Loading...</div>
	}

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
};

const useAuth = () => {
	return useContext(AuthContext);
};

export { AuthProvider, useAuth };
