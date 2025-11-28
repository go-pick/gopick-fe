import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledStartButton = styled(Link)`
	display: inline-block;
	background-color: rgba(255, 255, 255, 0.5);
	color: #ffffff;
	font-size: 1.2em;
	width: 15em;
	text-decoration: none;
	text-align: center;
	padding: 1em;
	border-radius: 30px;
	margin: 3em;
	&:hover {
		background-color: rgba(255, 255, 255, 0.3);
	}
`;

const StartButton = () => {
    return (
        <StyledStartButton to={'/compare'}>
            지금 바로 비교하기
        </StyledStartButton>
    );
};

export default StartButton;