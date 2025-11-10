import React, { useState } from 'react';
import { TextBox, Button } from '../../components/common';
import S from './Login.styles';
import { useNavigate } from 'react-router-dom';
import { apiLogin } from '../../api/api';

const LoginPage = () => {
	const contentWidth = '30%';

	const navigate = useNavigate();

	const [inputs, setInputs] = useState({
		email: '',
		password: '',
	});

	const { email, password } = inputs;

	const [isLoading, setIsLoading] = useState(false);
	
	const [validation, setValidation] = useState({
		email: { status: 'defualt', message: '' },
		password: { status: 'default', message: '' },
	});
	
	const handleChange = (e) => {
        const { id, value } = e.target;
        
        // Input 값 변경
        setInputs((prev) => ({
            ...prev,
            [id]: value,
        }));
        
        // 입력 시작 시 모든 에러/캡션 초기화
        setValidation({
            email: { status: 'default', message: '' },
            password: { status: 'default', message: '' },
        });
    };

	const handleLoginClick = async () => {
        if (!email || !password) {
            setValidation({
                email: {
                    status: !email ? 'error' : 'default',
                    message: !email ? '이메일을 입력해주세요.' : '',
                },
                password: {
                    status: !password ? 'error' : 'default',
                    message: !password ? '비밀번호를 입력해주세요.' : '',
                }
            });
            return;
        }
		setIsLoading(true);

		try {
			const data = await apiLogin(email, password);

			localStorage.setItem('supabaseSession', JSON.stringify(data.session));
			alert('로그인 성공');
			navigate('/'); // 메인 페이지로
		} catch(err) {
			console.error('로그인 실패:', err);
            // API로부터 받은 에러 메시지를 캡션으로 설정
            setValidation({
                email: { status: 'error', message: '이메일 또는 비밀번호가 일치하지 않습니다.' },
                // 비밀번호 필드에는 에러 상태만 주고 메시지는 비워서 중복 방지 (선택 사항)
                password: { status: 'error', message: ' ' } 
            });
		} finally {
			setIsLoading(false);
		}
	};
	
	return (
		<S.Screen>
			<S.Title>로그인</S.Title>
			<S.ContentWrapper>
				<TextBox
					label={'email'}
					id={'email'}
					width={contentWidth}
					value={email}
					onChange={handleChange}
					caption={validation.email.message}
					status={validation.email.status}
				/>
				<TextBox
					label={'password'}
					id={'password'}
					width={contentWidth}
					type={'password'}
					value={password}
					onChange={handleChange}
					caption={validation.password.message}
					status={validation.password.status}
				/>
				<div style={{height: '3rem'}} ></div>
				<Button
					variant='solid'
					width={contentWidth}
					onClick={handleLoginClick}
					disable={isLoading}
				>
					로그인
				</Button>
			</S.ContentWrapper>
		</S.Screen>
	);
};

export default LoginPage;