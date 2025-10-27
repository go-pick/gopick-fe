import React from 'react';
import { BackgoundGradient, Description, SubTitle, Title } from './Main.styles';

const MainPage = () => {
	return (
		<BackgoundGradient>
			<Title>Go를만해</Title>
			<SubTitle>
				개인 맞춤형  IT 제품 비교 서비스
			</SubTitle>
			<Description>
				이 제품, 정말 나에게 <b>고를만해?</b> 더 이상 고민하지 마세요. <br/>
				가장 필요한 기능에 가중치를 두어 최적의 선택을 한눈에!
			</Description>
		</BackgoundGradient>
	);
};

export default MainPage;