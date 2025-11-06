import React, { useState } from 'react';
import { PersonCircle } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const MenuContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end; // 그리드 컬럼 내에서 우측 정렬
    height: 100%; // 부모(GridColumn -> GridContainer -> NavContainer)의 높이를 따름
`;

const UserIcon = styled(PersonCircle)`
    font-size: 28px; // 아이콘 크기 (네비바 높이 60px에 맞춰 적절히 조절)
    color: #ffffff;
    cursor: pointer;
    transition: opacity 0.2s ease;

    &:hover {
        opacity: 0.8;
    }
`;

const PopupWrapper = styled.div`
    position: absolute;
    top: 60px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px; // 팝업 너비
    background-color: ${({ theme }) => theme.background};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 8px 0;
    z-index: 10;
    
    /* * styled-components 5.1 이상 버전에서는 
     * React의 경고를 피하기 위해 transient props ($) 사용을 권장합니다.
     */
    display: ${props => (props.$isvisible ? 'block' : 'none')};
`;

const PopupItem = styled(Link)`
    display: block;
    padding: 10px 16px;
    font-size: 0.9rem;
    font-weight: 500;
    color: ${({ theme }) => theme.text}; // 테마의 텍스트 색상을 사용해도 좋습니다.
    text-decoration: none;
    text-align: center;

    &:hover {
        background-color: ${({ theme}) => theme.backgroundSub}; // 호버 시 배경색
    }
`;



const UserMenu = ({ isLoggedIn }) => {
    const [isMenuVisible, setMenuVisible] = useState(false);

    const showMenu = () => setMenuVisible(true);
    const hideMenu = () => setMenuVisible(false);

    return (
        <MenuContainer
            onMouseEnter={showMenu}
            onMouseLeave={hideMenu}
        >
            <UserIcon />
            <PopupWrapper $isvisible={isMenuVisible}>
                {isLoggedIn ? (
                    <>
                        <PopupItem to="/mypage">마이페이지</PopupItem>
                        <PopupItem to="/logout">로그아웃</PopupItem>
                    </>
                ) : (
                    <>
                        <PopupItem to="login">로그인</PopupItem>
                        <PopupItem to="signup">회원가입</PopupItem>
                    </>
                )}
            </PopupWrapper>
            
        </MenuContainer>
    );
};

export default UserMenu;