import styled from "styled-components";

const S = {};

S.PageContainer = styled.div`
	min-height: 100vh;
	padding: 60px 0; // navbar height
`;

S.StickySidebarWrapper = styled.aside`
    position: sticky;
    top: 80px; /* 상단에서 40px 떨어진 위치에 고정 */
    width: 100%;
    
    /* 스타일링 */
    background-color: transparent;
    padding: 24px;
    border-radius: 30px;
    border: 1px solid ${({ theme }) => theme.gray.regular};
`;

S.ContentListWrapper = styled.main`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
    border-radius: 30px;
    border: 1px solid ${({ theme }) => theme.gray.regular};
`;

export default S;