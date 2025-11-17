import React from 'react';
import { ClockHistory, Envelope, Lock } from 'react-bootstrap-icons';
import { Link, NavLink } from 'react-router-dom';
import styled from 'styled-components';

const SidebarContainer = styled.nav`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	padding: 0 ${props => (props.$isExpanded ? '0px' : 'calc((100% - 54px) / 2)')};;
	transition: padding 0.3s ease-in-out;
`;

const SidebarLink = styled(NavLink)`
	display: flex;
	align-items: center;
	text-decoration: none;
	margin-bottom: 0.75rem;
	border-radius: 30px;
	padding: 14px;
	color: ${({ theme }) => theme.text};
	border: 1px solid ${({theme}) => theme.gray.regular};

	svg {
		font-size: 1.5rem;
		flex-shrink: 0;
		color: ${({ theme }) => theme.main.regular};
		transition: color 0.2s ease;
	}

	/* animation */
	width: ${props => (props.$isExpanded ? '100%' : '54px')};
	height: 54px;
	justify-content: flex-start;
	background-color: transparent;
	transition: background-color 0.3s ease-out,
			color 0.3s ease-out,
			width 0.3s ease-out;

	&.active {
		background-color: ${({ theme }) => theme.main.regular};
		color: #ffffff;
		border-color: ${({ theme }) => theme.main.darken};
		svg {
			color: #ffffff;
		}
	}

	&:not(.active):hover {
		background-color: ${({ theme }) => theme.backgroundSub};
	}
`;

const LinkText = styled.span`
	font-size: 1rem;
	white-space: nowrap;
	margin-left: ${props => (props.$isExpanded ? '1rem' : 0)};
	opacity: ${props => (props.$isExpanded ? 1 : 0)};
	max-width: ${props => (props.$isExpanded ? '150px' : '0px')};
	overflow: hidden;
	transition: all 0.3s ease-in;
`;

const MyPageSideBar = ({ isUiExpanded, isPaddingExpanded }) => {
	return (
		<SidebarContainer $isExpanded={isPaddingExpanded}>
			<SidebarLink to="/mypage/history" end $isExpanded={isUiExpanded}>
				<ClockHistory />
				<LinkText $isExpanded={isUiExpanded}>
					사용내역 확인하기
				</LinkText>
			</SidebarLink>
			<SidebarLink to="/mypage/password" $isExpanded={isUiExpanded}>
				<Lock />
				<LinkText $isExpanded={isUiExpanded}>
					비밀번호 변경하기
				</LinkText>
			</SidebarLink>
			<SidebarLink to="/mypage/email" $isExpanded={isUiExpanded}>
				<Envelope />
				<LinkText $isExpanded={isUiExpanded}>
					이메일 변경하기
				</LinkText>
			</SidebarLink>

		</SidebarContainer>
	);
};

export default MyPageSideBar;