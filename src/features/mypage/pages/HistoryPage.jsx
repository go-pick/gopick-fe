import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'react-bootstrap-icons';
import S from '../MyPage.styles'; // 공통 스타일
import { getHistoryList } from '../../../api/api'; // api.js에서 함수 임포트
import { useAuth } from '../../../contexts/AuthContext';

const HistoryPage = () => {
    const navigate = useNavigate();
    const [histories, setHistories] = useState([]);
    const [loading, setLoading] = useState(true);

	const { session } = useAuth();

    useEffect(() => {
        const loadData = async () => {
            try {
                // 1. 백엔드에서 가벼운 리스트 데이터 호출
                const data = await getHistoryList(session.access_token);
                setHistories(data);
            } catch (err) {
                // 에러 처리 (필요시 alert 등)
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [session]);

	// 날짜 포맷팅 (방금 전, 어제 등)
	const formatTime = (dateString) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffMin = Math.floor((now - date) / 1000 / 60);

		if (diffMin < 1) return '방금 전';
		if (diffMin < 60) return `${diffMin}분 전`;
		
		const diffHour = Math.floor(diffMin / 60);
		if (diffHour < 24) return `${diffHour}시간 전`;
		
		const diffDay = Math.floor(diffHour / 24);
		if (diffDay < 7) return `${diffDay}일 전`;

		return `${date.getMonth() + 1}월 ${date.getDate()}일`;
	};

    // 스펙 요약 배열(['battery', 'price'])을 한글 문자열로 변환
	const formatSpecSummary = (specsArray) => {
		if (!specsArray || specsArray.length === 0) return '기본 비교';
		
		// 백엔드에서 이미 한글로 보내주므로 매핑 없이 바로 join
		const text = specsArray.join(', ');
		
		// 말줄임 처리
		return text.length > 30 ? text.substring(0, 30) + '...' : text;
	};

    // 상세 페이지 이동
    const handleItemClick = (id) => {
        navigate(`/mypage/history/${id}`);
    };

    return (
        <S.ContentWrapper>
            <S.SubTitle>사용내역 확인하기</S.SubTitle>
            
            <ListContainer>
                {loading ? (
                    <StateMsg>기록을 불러오는 중...</StateMsg>
                ) : histories.length > 0 ? (
                    histories.map(item => (
                        <HistoryItem key={item.id} onClick={() => handleItemClick(item.id)}>
                            <Time>{formatTime(item.created_at)}</Time>
                            <ItemTitle>{item.title}</ItemTitle>
                            <ItemDesc>
                                <span className="label">중요 항목 : </span> 
                                {formatSpecSummary(item.specsSummary)}
                            </ItemDesc>
                            <ArrowIcon><ChevronRight /></ArrowIcon>
                        </HistoryItem>
                    ))
                ) : (
                    <StateMsg>아직 비교 기록이 없습니다.</StateMsg>
                )}
            </ListContainer>
        </S.ContentWrapper>
    );
};

export default HistoryPage;

/* --- Local Styles --- */

const ListContainer = styled.div`
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const HistoryItem = styled.button`
    width: 100%;
    text-align: left;
    background-color: transparent;
    padding: 24px;
    border-radius: 16px;
    position: relative;
    cursor: pointer;

    &:hover {
        background-color: ${({ theme }) => theme.backgroundSub};
    }
`;

const Time = styled.div`
    font-size: 0.8rem;
    color: ${({ theme }) => theme.textSub};
    margin-bottom: 8px;
`;

const ItemTitle = styled.div`
	font-size: 1.1rem;
	font-weight: 700;
	color: ${({ theme }) => theme.text};
	margin-bottom: 8px;

	/* 말줄임 처리 (제목이 너무 길 경우) */
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	padding-right: 20px; 
`;

const ItemDesc = styled.div`
    font-size: 0.9rem;
    color: ${({ theme }) => theme.text};
    font-weight: 400;

    .label {
        color: ${({ theme }) => theme.text};
        font-size: 0.85rem;
    }
`;

const ArrowIcon = styled.div`
    position: absolute;
    right: 24px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.main.regular}; 
    font-size: 20px;
    display: flex; 
    align-items: center;
`;

const StateMsg = styled.div`
    text-align: center;
    color: ${({ theme }) => theme.textSub};
    padding: 60px 0;
    font-size: 0.95rem;
`;