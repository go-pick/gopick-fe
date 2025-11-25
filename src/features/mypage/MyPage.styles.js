import styled from "styled-components";

const S = {};

S.PageContainer = styled.div`
	padding: 2rem 0;
	width: 100vw;
`;

S.Title = styled.h1`
	font-size: 2.25rem;
	font-weight: 600;
	text-align: center;
	margin-bottom: 3rem;
`;

S.ContentWrapper = styled.div`
	border-radius: 30px;
	/* padding: 2rem; */
	border: 1px solid ${({ theme }) => theme.gray.regular};
	width: 100%;
	min-height: 70vh; // 최소 높이

	transition: all 0.3s ease-in-out;
`;

S.SubTitle = styled.div`
	border-bottom: 1px solid ${({ theme }) => theme.gray.regular};
	height: 4rem;
	line-height: 4rem;
	padding: 0 2rem;
	font-size: 1.2rem;
	font-weight: 800;

`;

S.SubContentContainer = styled.div`
	padding: 2rem;
`;

S.SubDescription = styled.div`
	margin-bottom: 1rem;
`;


export default S;