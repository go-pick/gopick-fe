import { Link } from "react-router-dom";
import styled from "styled-components";

const S = {};

S.NavContainer = styled.nav`
    position: sticky;
    top: 0;
    width: 100%;
    height: 60px;
    background-color: ${({ theme }) => theme.main.regular};
    
`;

S.MenuWrapper = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 100%;
`;

S.MenuItem = styled(Link)`
    font-size: 1rem;
    line-height: 60px;
    color: #FFFFFF;
    font-weight: 400;
    display: inline-block;
    height: 100%;
    padding: 0 10px;

    &:hover {
        font-weight: 600;
        border-bottom: #FFFFFF solid 3px;
    }
`;



export default S;