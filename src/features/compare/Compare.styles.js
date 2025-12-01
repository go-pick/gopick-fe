import styled from "styled-components";

const S = {};

S.PageContainer = styled.div`
	min-height: 100vh;
	padding: 60px 0; // navbar height
`;

S.StickySidebarWrapper = styled.aside`
	position: sticky;
	top: 80px;
	width: 100%;

	/* 스타일링 */
	background-color: transparent;
	border-radius: 30px;
	border: 1px solid ${({ theme }) => theme.gray.regular};
	overflow: hidden;
`;

S.ContentListWrapper = styled.main`
	display: flex;
	flex-direction: column;
	width: 100%;
	/* min-height: 75vh; */
	border-radius: 30px;
	border: 1px solid ${({ theme }) => theme.gray.regular};
	overflow: hidden;
`;

S.SubTitle = styled.div`
	border-bottom: 1px solid ${({ theme }) => theme.gray.regular};
	height: 4rem;
	line-height: 4rem;
	padding: 0 2rem;
	font-size: 1.2rem;
	text-align: center;
`;

export default S;