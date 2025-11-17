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
	padding: 2rem;
	border: 1px solid ${({ theme }) => theme.gray.regular};
	width: 100%;
	min-height: 70vh; // 최소 높이

	transition: all 0.3s ease-in-out;
`;

export default S;