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
	background-color: ${({ theme }) => theme.background};
	border-radius: 12px;
	padding: 2rem;
	width: 100%;
	min-height: 60vh; // 최소 높이

	/* 콘텐츠 영역이 바뀔 때 부드러운 전환 효과 */
	transition: all 0.3s ease-in-out;
`;

export default S;