import styled from 'styled-components';

const BackgoundGradient = styled.div`
	height: 100vh;
	background: linear-gradient(
		to bottom,
		#212175 10%,
		#3878A9 60%,
		#2D2D2D 100%
	);
`;

const Title = styled.div`
	color: '#FFFFFF';
	font-size: 5em;
	font-weight: bold;
	text-align: center;
	padding-top: 2em;
`;

const SubTitle = styled.div`
	color: '#FFFFFF';
	font-size: 2em;
	font-weight: 400;
	text-align: center;
	padding: 1em;
	`;

const Description = styled.div`
	color: '#FFFFFF';
	font-size: 1.2em;
	font-weight: 200;
	text-align: center;
	& b {
		font-weight: 600;
	}
`;



export { BackgoundGradient, Title, SubTitle, Description };