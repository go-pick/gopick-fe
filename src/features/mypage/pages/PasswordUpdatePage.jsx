import React, { useEffect, useState } from 'react';
import S from '../MyPage.styles';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../supabaseClient';
import { Button, TextBox } from '../../../components/common';
import { confirmPasswordReset } from '../../../api/api';

const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,25}$/;

const PasswordUpdatePage = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);

	const [pwState, setPwState] = useState({
		value: '',
		status: 'default',
		caption: '영문, 숫자, 특수문자를 포함하여 8자 이상 입력해주세요.'
	});

	const [confirmState, setConfirmState] = useState({
		value: '',
		status: 'default',
		caption: '새 비밀번호를 한 번 더 입력해주세요.'
	});

	useEffect(() => {
        // 이 페이지에 들어왔다는 건 링크를 탔다는 뜻.
        // 세션이 잘 맺어졌는지 확인만 하고 바로 폼을 보여줍니다.
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                alert("잘못된 접근이거나 링크가 만료되었습니다.");
                navigate('/login');
            }
            setIsLoading(false);
        };
        
        // Supabase가 URL 토큰을 처리할 시간을 아주 살짝 벌어줍니다.
        setTimeout(checkSession, 500);
        
        // (옵션) Auth 상태 감지 리스너가 필요하다면 여기에 추가
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_OUT') navigate('/login');
        });
        
        return () => subscription.unsubscribe();
    }, [navigate]);

	const handlePasswordChange = (e) => {
		const newVal = e.target.value;
		const isValid = PASSWORD_REGEX.test(newVal);
		const isError = newVal.length > 0 && !isValid;

		setPwState({
			value: newVal,
			status: isError ? 'error' : (isValid ? 'success' : 'default'),
			caption: isError 
				? '영문, 숫자, 특수문자를 포함하여 8~25자로 입력하세요.'
				: (isValid ? '사용가능한 비밀번호입니다.' : '영문, 숫자, 특수문자를 포함하여 8자 이상 입력해주세요.')
		});

		if (confirmState.value.length > 0) {
			const isMatch = newVal === confirmState.value;
			setConfirmState(prev => ({
				...prev,
				status: isMatch ? 'success' : 'error',
				caption: isMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'
			}));
		}
	};

	const handleConfirmChange = (e) => {
		const newVal = e.target.value;
		const isMatch = newVal === pwState.value;
		const isEmpty = newVal.length === 0;

		setConfirmState({
			value: newVal,
			status: isEmpty ? 'default' : (isMatch ? 'success' : 'error'),
			caption: isEmpty
				? '새 비밀번호를 한번 더 입력하세요.'
				: (isMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.')
		});
	};

	const handleSubmitChange = async () => {
		if (pwState.status !== 'success' || confirmState.status !== 'success') return;

		try {
            const { error } = await supabase.auth.updateUser({
                password: pwState.value
            });

            if (error) throw error;

            alert('비밀번호가 성공적으로 변경되었습니다.\n다시 로그인해주세요.');
            await supabase.auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error(error);
            alert('변경 실패: ' + error.message);
        }
	}
	
	if (isLoading) return <div style={{padding:'50px', textAlign:'center'}}>인증 정보를 확인 중입니다...</div>;

	return (
		<S.ContentWrapper>
			<S.SubTitle>비밀번호 변경하기</S.SubTitle>
			<S.SubContentContainer>
				<S.SubDescription>
					새 비밀번호 설정
				</S.SubDescription>
				<TextBox
					label="새 비밀번호"
					type="password"
					value={pwState.value}
					onChange={handlePasswordChange}
					status={pwState.status}
					caption={pwState.caption}
					width="80%"
				></TextBox>
				<div style={{height: '3rem'}} ></div>
				<TextBox
					label="비밀번호 확인"
					type="password"
					value={confirmState.value}
					onChange={handleConfirmChange}
					status={confirmState.status}
					caption={confirmState.caption}
					width="80%"
				></TextBox>
				<div style={{height: '3rem'}} ></div>
				<Button
					width={"200px"}
					onClick={handleSubmitChange}
					disabled={pwState.status !== 'success' || confirmState.status !== 'success'}
				>
					비밀번호 변경완료
				</Button>
			</S.SubContentContainer>
		</S.ContentWrapper>
	);
};

export default PasswordUpdatePage;