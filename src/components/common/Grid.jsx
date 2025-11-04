import { StyledGridColumn, StyledGridContainer } from "./Grid.styles";

const GridContainer = ({ children }) => {
    return (
        <StyledGridContainer>{children}</StyledGridContainer>
    );
};

const GridColumn = ({ children, col }) => {
    return (
        <StyledGridColumn col={col} >{children}</StyledGridColumn>
    );
};

export { GridColumn, GridContainer };