import React from 'react';
import { TextBox, Button } from '../../components/common';
import S from './Login.styles';

const LoginPage = () => {
	return (
		<S.Screen>
			<S.Title>로그인</S.Title>
			<S.ContentWrapper>
				<TextBox
					label={'id'}
					width={'30%'}
				/>
				<TextBox
					label={'password'}
					width={'30%'}
					type={'password'}
				/>
				<div style={{height: '3rem'}} ></div>
				<Button
					variant='solid'
					width={'30%'}
				>
					로그인
				</Button>
			</S.ContentWrapper>
		</S.Screen>
	);
};

export default LoginPage;