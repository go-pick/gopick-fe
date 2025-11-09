import React from 'react';
import { TextBox, Button } from '../../components/common';
import S from './Login.styles';

const LoginPage = () => {
	const contentWidth = '30%';
	return (
		<S.Screen>
			<S.Title>로그인</S.Title>
			<S.ContentWrapper>
				<TextBox
					label={'id'}
					id={'textbox-username'}
					width={contentWidth}
				/>
				<TextBox
					label={'password'}
					width={contentWidth}
					type={'password'}
				/>
				<div style={{height: '3rem'}} ></div>
				<Button
					variant='solid'
					width={contentWidth}
				>
					로그인
				</Button>
			</S.ContentWrapper>
		</S.Screen>
	);
};

export default LoginPage;