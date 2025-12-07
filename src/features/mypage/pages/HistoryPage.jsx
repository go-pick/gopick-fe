import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, ChevronDown } from 'react-bootstrap-icons';
import S from '../MyPage.styles'; 
import { getHistoryList } from '../../../api/api'; 
import { useAuth } from '../../../contexts/AuthContext';

const HistoryPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { session } = useAuth();

    // --- State ---
    const [histories, setHistories] = useState([]);
    const [loading, setLoading] = useState(false); // 초기값 false (useEffect에서 true로 전환)
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const LIMIT = 10;

    // --- Data Fetching ---
    const fetchHistories = async (pageNum) => {
        if (!session) return;
        setLoading(true);

        try {
            const response = await getHistoryList(session.access_token, pageNum, LIMIT);
            const newData = response.list || []; 
            const total = response.totalCount || 0;

            setTotalCount(total);

            if (pageNum === 1) {
                setHistories(newData);
            } else {
                setHistories(prev => [...prev, ...newData]);
            }
        } catch (err) {
            console.error("History fetch error:", err.message);
        } finally {
            setLoading(false);
        }
    };

    // 1. 초기 진입 로드
    useEffect(() => {
        setPage(1);
        fetchHistories(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session, location.key]);

    // 2. 더보기 로드
    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchHistories(nextPage);
    };

    // --- Helper Functions ---
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

    const formatSpecSummary = (specsArray) => {
        if (!specsArray || specsArray.length === 0) return '기본 비교';
        const text = specsArray.join(', ');
        return text.length > 30 ? text.substring(0, 30) + '...' : text;
    };

    const handleItemClick = (id) => {
        navigate(`/mypage/history/${id}`);
    };

    return (
        <S.ContentWrapper>
            <S.SubTitle>사용내역 확인하기</S.SubTitle>
            
            <ListContainer>
                {/* [CASE 1] 초기 로딩 중일 때 (데이터가 없고 로딩 중)
                    -> "로딩중" 글씨만 중앙에 표시
                */}
                {loading && histories.length === 0 ? (
                    <LoadingWrapper>
                        <LoadingText>로딩중...</LoadingText>
                    </LoadingWrapper>
                ) : (
                    /* [CASE 2] 로딩이 끝났거나, 데이터가 있는 경우 */
                    <>
                        {/* 리스트 출력 */}
                        {histories.length > 0 ? (
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
                            /* 데이터 없음 메시지 (로딩 아님 && 데이터 0개) */
                            <StateMsg>아직 비교 기록이 없습니다.</StateMsg>
                        )}

                        {/* [CASE 3] 추가 로딩 중일 때 (페이지네이션)
                            -> 리스트 하단에 "불러오는 중..." 표시
                        */}
                        {loading && histories.length > 0 && (
                            <LoadingText>불러오는 중...</LoadingText>
                        )}

                        {/* 더 불러오기 버튼 */}
                        {!loading && histories.length < totalCount && (
                            <LoadMoreButton onClick={handleLoadMore}>
                                10개 더 불러오기 <ChevronDown />
                            </LoadMoreButton>
                        )}
                    </>
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
    padding-bottom: 60px;
    min-height: 200px; // 로딩 중일 때 높이 확보
`;

const LoadingWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px; // 화면 중앙 느낌
    width: 100%;
`;

const LoadingText = styled.div`
    text-align: center;
    color: ${({ theme }) => theme.textSub};
    font-size: 0.95rem;
    padding: 20px;
`;

const HistoryItem = styled.button`
    width: 100%;
    text-align: left;
    background-color: transparent;
    padding: 24px;
    border-radius: 16px;
    position: relative;
    cursor: pointer;
    border: 1px solid transparent; 

    &:hover {
        background-color: ${({ theme }) => theme.backgroundSub};
    }
`;

const LoadMoreButton = styled.button`
    width: 100%;
    padding: 16px;
    margin-top: 12px;
    border-radius: 12px;
    background-color: ${({ theme }) => theme.backgroundSub}; 
    color: ${({ theme }) => theme.textSub};
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s ease;
    border: none;

    &:hover {
        background-color: ${({ theme }) => theme.border};
        color: ${({ theme }) => theme.text};
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