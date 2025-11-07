import styled from "styled-components";

const S = {};

S.Screen = styled.div`
	min-height: 100vh;
	display: flex;
	flex-direction: column;
`;

S.Title = styled.div`
	text-align: center;
	font-size: 36px;
	padding: 2rem;
	margin-bottom: 2rem;
`;

S.ContentWrapper = styled.div`
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
`;

export default S;