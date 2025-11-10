import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import S from './Signup.styles';
import { Spinner } from '../../components/common';
import { supabase } from '../../supabaseClient';

const VerifyEmailPage = () => {
	const [status, setStatus] = useState('인증을 확인중입니다...');
	const navigate = useNavigate();

	useEffect(() => {
		const { data: {subscription}} = supabase.auth.onAuthStateChange(
			(event, session) => {
				// 'SIGNED_IN' 이벤트 발생 = url토큰으로 인증 성공
				if (event === 'SIGNED_IN' && session) {
					setStatus('인증이 완료되었습니다! 잠시 후 로그인 페이지로 이동합니다.');
					
					setTimeout(() => {
						navigate('/login');
					}, 3000);
				}
			}
		);

		// 컴포넌트가 사라질 때 리스너를 정리한다.
		return () => {
			subscription.unsubscribe();
		};
	},[navigate])
	return (
		<S.Screen>
			<S.Title>이메일 인증</S.Title>
			<S.Description>
				<p>{status}</p>
				<Spinner />
			</S.Description>
		</S.Screen>
	);
};

export default VerifyEmailPage;