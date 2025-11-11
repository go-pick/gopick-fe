import React, { useCallback, useRef, useState } from 'react';
import S from './Signup.styles';
import { Button, TextBox } from '../../components/common';
import _ from 'lodash';
import { checkUsername, signup } from '../../api/api';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
	const navigate = useNavigate();

	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');

	const usernameRef = useRef(null);
	const emailRef = useRef(null);
	const passwordRef = useRef(null);
	const passwordConfirmRef = useRef(null);

	const [usernameCaption, setUsernameCaption] = useState('');
	const [usernameStatuts, setUsernameStatus] = useState('default');

	const [emailCaption, setEmailCaption] = useState('');
	const [emailStatus, setEmailStatus] = useState('default');
	
	const [passwordStatus, setPasswordStatus] = useState('default');
	const [passwordCaption, setPasswordCaption] = useState(
		"8자 이상, 영문/숫자/특수문자를 포함해 주세요." 
	);

	const [confirmCaption, setConfirmCaption] = useState('');
	const [confirmStatus, setConfirmStatus] = useState('default');

	const checkUsernameApi = useCallback(
		_.debounce(async (name) => {
			try {
				const { data } = await checkUsername(name);

				if (data.isDuplicate) {
					setUsernameCaption('이미 사용 중인 아이디입니다.');
					setUsernameStatus('error');
				} else {
					setUsernameCaption('사용 가능한 아이디입니다.');
					setUsernameStatus('success');
				}
			} catch(error) {
				console.error('중복 확인 실패 :', error);
				setUsernameCaption('중복 확인 중 오류가 발생했습니다.');
				setUsernameStatus('error');
			}
		}, 500),	// delay : 500ms
		[]
	);

	const handleUsernameChange = (e) => {
		const value = e.target.value;
		setUsername(value);

		// 1. 정규식
		const regex = /^[a-zA-Z0-9]*$/;
		if (!regex.test(value)) {
			setUsernameCaption('아이디는 영어와 숫자만 사용할 수 있습니다.');
			setUsernameStatus('error');
			checkUsernameApi.cancel();
			return;
		}
		// 2. 최소 길이
		if (value.length > 0 && value.length < 6) {
			setUsernameCaption('아이디는 6글자 이상이어야 합니다.');
			setUsernameStatus('error');
			checkUsernameApi.cancel();
			return;
		}
		// 3 모든 규칙 통과
		if (value.length >= 6) {
			setUsernameCaption('중복 확인 중...');
			setUsernameStatus('success');
			checkUsernameApi(value);
		} else {
			// 0글자 일 때 (초기화)
			setUsernameCaption('');
			setUsernameStatus('defualt');	
			checkUsernameApi.cancel();
		}

	};

	const validateEmail = (email) => {
		const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

		if (email.length === 0) {
			setEmailCaption('');
			setEmailStatus('default');
			return false;
		}

		if (!regex.test(email)) {
			setEmailCaption('올바른 이메일 형식이 아닙니다.');
			setEmailStatus('error');
			return false;
		}

		setEmailCaption('');
		setEmailStatus('default');
		return true;
	}

	const handleEmailChange = (e) => {
		const newEmail = e.target.value;
		setEmail(newEmail);
		validateEmail(newEmail);
	};

	const validatePassword = (pw) => {
		// 정규식
		const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{10,}$/;

		if (pw.length === 0) {
			setPasswordCaption('10자 이상, 영문/숫자 조합');
			setPasswordStatus('default');
			return false;
		}

		if (!regex.test(pw)) {
			setPasswordCaption('10자 이상, 영문/숫자 조합을 충족해야 합니다.');
			setPasswordStatus('error');
			return false;
		}

		setPasswordCaption('사용 가능한 비밀번호입니다.');
		setPasswordStatus('success');
		return true;
	};

	const handlePasswordChange = (e) => {
		const newPassword = e.target.value;
		setPassword(newPassword);

		// 실시간 유효성 검사
		validatePassword(newPassword);
		if (passwordConfirm.length > 0) {
			if (newPassword === passwordConfirm) {
				setConfirmCaption('비밀번호가 일치합니다.');
				setConfirmStatus('default');
			} else {
				setConfirmCaption('비밀번호가 일치하지 않습니다.');
				setConfirmStatus('error');
			}
		}

	};

	const handlePasswordConfirmChange = (e) => {
		const confirmValue 	= e.target.value;
		setPasswordConfirm(confirmValue);

		if (confirmValue.length === 0 ) {
			setConfirmCaption('');
			setConfirmStatus('default');
			return;
		}

		if (password === confirmValue) {
			setConfirmCaption('비밀번호가 일치합니다.');
			setConfirmStatus('default');
		} else {
			setConfirmCaption('비밀번호가 일치하지 않습니다.');
			setConfirmStatus('error');
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();	// form의 새로고침을 막는다.

		// 최종 유혀성 검사
		if (usernameStatuts === 'error' || username.length < 6) {
			alert('아이디를 확인해주세요.');
			usernameRef.current.focus();
			return;
		}
		if (usernameCaption === '중복 확인 중...') {
			alert('아이디 중복 확인이 완료될 때 까지 잠시 기다려주세요.');
			usernameRef.current.focus();
			return;
		}

		if (!validateEmail(email)) {
			alert('이메일 형식을 확인해주세요.');
			emailRef.current.focus();
			return;
		}

		if (!validatePassword(password)) {
			alert('비밀번호 형식을 확인해주세요.');
			passwordRef.current.focus();
			return;
		}

		if (password !== passwordConfirm) {
			setConfirmCaption('비밀번호가 일치하지 않습니다.');
            setConfirmStatus('error');
            alert('비밀번호가 일치하지 않습니다.');
            passwordConfirmRef.current.focus(); // 3. 포커스 이동
            return;
		}

		// BE API
		try {
			const { data } = await signup({ username, email, password });	
			alert('회원가입이 완료되었습니다! 이메일 인증 후 로그인 해주세요.');
			navigate('/login');
			// setIsEmailSent(true);
		} catch (error) {
			console.error('회원가입 실패 :', error.response?.data);
			alert(`회원가입 실패: ${error.response?.data?.error || '알 수 없는 오류'}`);
		}
	};

	return (
		<S.Screen>
			<S.Title>회원가입</S.Title>
			<S.ContentWrapper as='form' onSubmit={handleSubmit}>
				<TextBox
					label={'ID'}
					id={'textbox-username'}
					value={username}
					onChange={handleUsernameChange}
					caption={usernameCaption}
					status={usernameStatuts}
				/>
				<TextBox
					label={'Email Address'}
					id={'textbox-email'}
					type='email'
					value={email}
					onChange={handleEmailChange} 
					caption={emailCaption}
					status={emailStatus}
					required
				/>
				<TextBox
					label={'Password'}
					id={'textbox-password'}
					type='password'
					value={password}
					onChange={handlePasswordChange}
					caption={passwordCaption}
					status={passwordStatus}
					required
				/>
				<TextBox
					label={'Password Check'}
					id={'textbox-password-check'}
					type='password'
					value={passwordConfirm}
					onChange={handlePasswordConfirmChange}
					caption={confirmCaption}
					status={confirmStatus}
					required
				/>
				<S.Description>
					회원가입 후 인증 이메일이 발송됩니다 <br />
					이메일 인증 절차를 꼭 밟아주세요
				</S.Description>
				<Button variant='solid' type="submit">
					회원가입
				</Button>
				<div style={{height: '7rem'}} ></div>
			</S.ContentWrapper>
		</S.Screen>
	);
};

export default SignupPage;