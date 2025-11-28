// src/features/comparison/components/WeightConfigurator/WeightConfigPlaceholder.jsx
import React from 'react';
import styled, { useTheme } from 'styled-components';
import { ExclamationCircleFill } from 'react-bootstrap-icons'; // 아이콘 사용
import S from '../Compare.styles';

const WeightConfigPlaceholder = () => {
	const theme = useTheme();
    return (
        <Container>
            <S.SubTitle>당신이 중요하게 생각하는 것은?</S.SubTitle>
            <GrayBox>
                <MessageContent>
                    <ExclamationCircleFill size={20} color={theme.sub} />
                    <span>비교하기는 2개 이상의 제품이 선택되어야 가능합니다.</span>
                </MessageContent>
            </GrayBox>
        </Container>
    );
};

export default WeightConfigPlaceholder;

// --- Styles ---
const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
`;
const GrayBox = styled.div`
    flex: 1; /* 남은 공간을 꽉 채움 */
    min-height: 400px; /* 최소 높이 확보 */
    background-color: ${({ theme }) => theme.backgroundSub}; /* 이미지와 비슷한 회색 */
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

	transition: background-color 0.3s ease-out;
`;

const MessageContent = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${({ theme }) => theme.textSub};
    font-size: 0.95rem;
    font-weight: 500;
    
    /* 필요하다면 배경을 흰색으로 살짝 깔아줄 수도 있음 */
    /* background: rgba(255,255,255,0.8); */
    /* padding: 10px 20px; */
    /* border-radius: 8px; */
`;