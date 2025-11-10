import React, { useState } from 'react';
import { PersonCircle } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useAuth } from '../../../contexts/AuthContext';

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
    box-shadow: 0 4px 12px ${({ theme }) => theme.shadow};
    padding: 8px 0;
    z-index: 10;
    
    /* * styled-components 5.1 이상 버전에서는 
     * React의 경고를 피하기 위해 transient props ($) 사용을 권장합니다.
     */
    display: ${props => (props.$isvisible ? 'block' : 'none')};
`;

const popupItemStyles = css`
    display: block;
    width: 100%;
    padding: 10px 16px;
    font-size: 0.9rem;
    font-weight: 500;
    color: ${({ theme }) => theme.text};
    text-decoration: none;
    text-align: center;
    background: none;
    border: none;
    cursor: pointer;

    &:hover {
        background-color: ${({ theme}) => theme.backgroundSub};
    }
`;

const PopupLink = styled(Link)`
    ${popupItemStyles}
`;

const PopupButton = styled.button`
    ${popupItemStyles}
`;

const LogoutButton = styled(PopupButton)`
    color: ${({ theme }) => theme.semantic.error};
`;


const UserMenu = () => {
    const { isLoggedIn, logout } = useAuth();

    const [isMenuVisible, setMenuVisible] = useState(false);

    const showMenu = () => setMenuVisible(true);
    const hideMenu = () => setMenuVisible(false);

    const handleLogout =  async () => {
        await logout();
        hideMenu();
    };

    return (
        <MenuContainer
            onMouseEnter={showMenu}
            onMouseLeave={hideMenu}
        >
            <UserIcon />
            <PopupWrapper $isvisible={isMenuVisible}>
                {isLoggedIn ? (
                    <>
                        <PopupLink to="/mypage" onClick={hideMenu}>마이페이지</PopupLink>
                        <LogoutButton to="/logout" onClick={handleLogout}>로그아웃</LogoutButton>
                    </>
                ) : (
                    <>
                        <PopupLink to="login" onClick={hideMenu}>로그인</PopupLink>
                        <PopupLink to="signup" onClick={hideMenu}>회원가입</PopupLink>
                    </>
                )}
            </PopupWrapper>
            
        </MenuContainer>
    );
};

export default UserMenu;