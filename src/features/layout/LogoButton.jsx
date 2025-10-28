import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledLogoButton = styled(Link)`
    font-weight: 700;
    font-size: 24px;
    aspect-ratio: 1;
    width: 45px;
    line-height: 45px;
    color: ${({ theme }) => theme.main.regular};
    background-color: #ffffff;
    border-radius: 10px;
    text-align: center;
`;

const LogoButton = () => {
    return (
        <StyledLogoButton to={"/"}>
            Go
        </StyledLogoButton>
    );
};

export default LogoButton;