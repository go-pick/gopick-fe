import React, { useState } from 'react';
import { PersonCircle, SunFill, MoonFill } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';

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

const ThemeToggle = styled.button`
	display: flex;
	align-items: center;
	justify-content: space-between;
	background-color: ${({ theme }) => theme.backgroundSub};
	border: none;
	padding: 4px;
	border-radius: 30px;
	cursor: pointer;
	width: 80px;
	margin: 8px auto 0;
	position: relative;
	overflow: hidden;
	transition: background-color 0.5s;
`;

const MovingKnob = styled.div`
	position: absolute;
	top: 4px;
	left: 4px;
	width: 30px;
	height: 30px;
	border-radius: 50%;
	background-color: ${({ theme }) => theme.main.regular};
	z-index: 1;

	transition: transform 0.3s ease-in-out;

	/* $mode prop에 따라 이동 
		(이동 거리 = 아이콘 너비 30px + 중간 여백 4px = 34px) 
	*/
	transform: translateX(${props => (props.$mode === 'dark' ? '42px' : '0px')});
`;

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    transition: all 0.5s ease-in-out;
    z-index: 2;

	svg {
		font-size: 16px;
		color: ${props => props.$isactive
			? '#ffffff'
			: props.theme.textSub
		};
		transition: color 0.2s;
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
	transition: background-color 0.5s, box-shadow 0.5s;

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

	const { themeMode, toggleTheme } = useTheme();

	const [isMenuVisible, setMenuVisible] = useState(false);

	const showMenu = () => setMenuVisible(true);
	const hideMenu = () => setMenuVisible(false);

	const handleLogout =  async () => {
		await logout();
		hideMenu();
	};

	const handleThemeToggle = () => {
		toggleTheme();
	}

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

				<hr style={{ 
					margin: '8px 0', 
					border: 'none', 
					borderTop: `1px solid ${themeMode === 'light' ? '#eee' : '#444'}` 
				}} />

				<ThemeToggle onClick={toggleTheme}>
					<MovingKnob $mode={themeMode} />
					<IconWrapper $isactive={themeMode === 'light'}>
						<SunFill />
					</IconWrapper>
					<IconWrapper $isactive={themeMode === 'dark'}>
						<MoonFill />
					</IconWrapper>
				</ThemeToggle>
			</PopupWrapper>
			
		</MenuContainer>
	);
};

export default UserMenu;