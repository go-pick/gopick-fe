import React, { useEffect, useState } from 'react';
import S from './MyPage.styles';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { GridContainer, GridItem } from '../../components/common/grid/Grid';
import MyPageSideBar from './components/MyPageSidebar';

const ANIMATION_DURATION_MS = 300;

const MyPageLayout = () => {
	
	const [isInitialLoad, setIsInitialLoad] = useState(true);
	const [isHovered, setIsHovered] = useState(false);
	const [isGridExpanded, setIsGridExpanded] = useState(true);
	const [isPaddingExpanded, setIsPaddingExpanded] = useState(true);
	const [isUiExpanded, setIsUiExpanded] = useState(true);

	const { session } = useAuth();
	const location = useLocation();
	
	useEffect(() => {
        const timer = setTimeout(() => {
            setIsInitialLoad(false);
        }, 1000); 
        return () => clearTimeout(timer);
    }, []);

	const isMasterExpanded = isInitialLoad || isHovered;

	useEffect(() => {
        let timer; // 지연 타이머

        if (isMasterExpanded) {
            // --- (호버 시) ---
			setIsPaddingExpanded(true);

            timer = setTimeout(() => {
				setIsGridExpanded(true); 
                setIsUiExpanded(true);
            }, ANIMATION_DURATION_MS);

        } else {
            // --- (호버 해제 시) ---
            setIsUiExpanded(false); 

            timer = setTimeout(() => {
                setIsPaddingExpanded(false);
                setIsGridExpanded(false);
            }, ANIMATION_DURATION_MS);
        }

        return () => clearTimeout(timer);
    }, [isMasterExpanded]); // isMasterExpanded가 바뀔 때마다 실행

	const sidebarSpan = isGridExpanded ? 3 : 1;
	const contentSpan = isGridExpanded ? 7 : 9;
	const contentStart = 2 + sidebarSpan; // 사이드바 바로 다음 열에서 시작
	
	return (
		<S.PageContainer>
			<S.Title>
				{session?.user?.email ? `${session.user.email}님, ` : ''}환영합니다
			</S.Title>
			<GridContainer>
				<GridItem
					colStart={2}
					colSpan={sidebarSpan}
					onMouseEnter={()=>{setIsHovered(true)}}
					onMouseLeave={()=>{setIsHovered(false)}}
					// style={{ transition: 'all 0.3s ease-in-out' }}
				>
					<MyPageSideBar isUiExpanded={isUiExpanded} isPaddingExpanded={isPaddingExpanded}/>
				</GridItem>
				<GridItem
					colStart={contentStart}
					colSpan={contentSpan}
				>
					<Outlet />
				</GridItem>
			</GridContainer>
		</S.PageContainer>
	);
};

export default MyPageLayout;