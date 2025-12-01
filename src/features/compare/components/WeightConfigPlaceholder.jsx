import React from 'react';
import styled, { useTheme } from 'styled-components';
import { ExclamationCircleFill } from 'react-bootstrap-icons';
import S from '../Compare.styles';

const WeightConfigPlaceholder = () => {
	const theme = useTheme();
	return (
		<GrayBox>
			<MessageContent>
				<ExclamationCircleFill size={20} color={theme.sub} />
				<span>비교하기는 2개 이상의 제품이 선택되어야 가능합니다.</span>
			</MessageContent>
		</GrayBox>
    );
};

export default WeightConfigPlaceholder;

// --- Styles ---
const GrayBox = styled.div`
	flex: 1; 
	min-height: 400px;
	height: 100%;
	background-color: ${({ theme }) => theme.backgroundSub};
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
`;