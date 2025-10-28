import React from 'react';
import styled from 'styled-components';

const StyledStartButton = styled.button`
	background-color: rgba(255, 255, 255, 0.5);
	color: '#ffffff';
	font-size: 1.2em;
	width: 15em;
	padding: 1em;
	border-radius: 30px;
	margin: 3em;
	&:hover {
		background-color: rgba(255, 255, 255, 0.3);
	}
`;

const StartButton = () => {
    
    return (
        <StyledStartButton>
            지금 바로 비교하기
        </StyledStartButton>
    );
};

export default StartButton;