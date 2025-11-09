import styled from "styled-components";

const S = {};

S.Screen = styled.div`
	min-height: calc(100vh - 60px);
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
	width: 30%;
	margin: 0 auto;
	gap: 1rem;
`;

S.Description = styled.div`
	padding: 1rem 0 2rem;
	text-align: center;
`;

export default S;