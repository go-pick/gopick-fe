import styled from 'styled-components';

const BackgoundGradient = styled.div`
	height: calc(100vh - 60px);
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 3.5em;
	background: linear-gradient(
		to bottom,
		#212175 10%,
		#3878A9 60%,
		#2D2D2D 100%
	);
`;

const TextWrapper = styled.div`
	padding: 6em;
`;

const Title = styled.div`
	color: #FFFFFF;
	font-size: 4.5em;
	font-weight: bold;
	text-align: center;
	/* padding-top: 2em; */
`;

const SubTitle = styled.div`
	color: #FFFFFF;
	font-size: 2em;
	font-weight: 400;
	text-align: center;
	padding: 1em;
	`;

const Description = styled.div`
	color: #FFFFFF;
	font-size: 1.1em;
	font-weight: 200;
	text-align: center;
	& b {
		font-weight: 600;
	}
`;

export { BackgoundGradient, TextWrapper, Title, SubTitle, Description };