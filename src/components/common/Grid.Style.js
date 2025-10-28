import styled from "styled-components";

const StyledGridContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    align-items: center;
    height: 100%;
`;

const StyledGridColumn = styled.div`
    width: ${props => (props.col / 12) * 100}%;
    padding: 0 15px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`;

export { StyledGridContainer, StyledGridColumn };