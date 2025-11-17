import React, { useEffect, useState } from 'react';
import S from './MyPage.styles';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { GridContainer, GridItem } from '../../components/common/grid/Grid';
import MyPageSideBar from './components/MyPageSidebar';
import { getUsername } from '../../api/api';

const ANIMATION_DURATION_MS = 300;

const MyPageLayout = () => {
	
	const [isInitialLoad, setIsInitialLoad] = useState(true);
	const [isHovered, setIsHovered] = useState(false);
	const [isGridExpanded, setIsGridExpanded] = useState(true);
	const [isPaddingExpanded, setIsPaddingExpanded] = useState(true);
	const [isUiExpanded, setIsUiExpanded] = useState(true);

	const [username, setUsername] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const { session } = useAuth();
	const location = useLocation();

	useEffect(() => {
		const fetchUsername = async () => {
			if (!session) {
				setIsLoading(false);
				return;
			}
			
			try {
				const profileData = await getUsername(session.access_token);
				setUsername(profileData.username);
			} catch(error) {
				console.error('Failed to fetch username:' , error);
			} finally {
				setIsLoading(false);
			}
		};
		
		fetchUsername();
		
	}, [session]);
	
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
			setIsGridExpanded(false);
            timer = setTimeout(() => {
				setIsPaddingExpanded(false);
            }, ANIMATION_DURATION_MS);
        }
		
        return () => clearTimeout(timer);
    }, [isMasterExpanded]); // isMasterExpanded가 바뀔 때마다 실행
	
	const sidebarColStart = 2;
	const sidebarColSpan = 1;
	const contentColStart = 3;
	const contentColSpan = 1;

	const gtc = isGridExpanded
        ? "1fr 3fr 7fr 1fr" // 사이드바 확장 시 (1 + 3 + 7 + 1 = 12)
        : "1fr 1fr 9fr 1fr"
	;
	
	return (
		<S.PageContainer>
			<S.Title>
				{
					isLoading
					? "회원 정보를 가져오는 중입니다."
					: `${username}님, 환영합니다.`
				}
			</S.Title>
			<GridContainer gtc={gtc}>
				<GridItem
					height="fit-content"
					align={"flex-start"}
					colStart={sidebarColStart}
					colSpan={sidebarColSpan}
					onMouseEnter={()=>{setIsHovered(true)}}
					onMouseLeave={()=>{setIsHovered(false)}}
					// style={{ transition: 'all 0.3s ease-in-out' }}
				>
					<MyPageSideBar isUiExpanded={isUiExpanded} isPaddingExpanded={isPaddingExpanded}/>
				</GridItem>
				<GridItem
					colStart={contentColStart}
					colSpan={contentColSpan}
				>
					<Outlet />
				</GridItem>
			</GridContainer>
		</S.PageContainer>
	);
};

export default MyPageLayout;