import styled from "styled-components";

const GridContainer = styled.div`
    display: grid;
    padding: 0 20px;

    grid-template-columns: ${props => props.gtc || 'repeat(12, 1fr)'};
    gap: ${props => props.gap || '1.5rem'};

    width: 100%;
    height: 100%;

    transition: grid-template-columns 300ms ease-in-out;
`;

const GridItem = styled.div`
    /* colStart: 아이템이 시작할 컬럼 번호 (1 ~ 12) */
    grid-column-start: ${props => props.colStart};

    /* colSpan: 아이템이 차지할 컬럼 개수 (기본값 1) */
    grid-column-end: span ${props => props.colSpan || 1};

    display: flex;
    flex-direction: column;
    justify-content: ${props => props.align || 'center'};
    align-items: center;
    height: ${props => props.height || '100%'};
`;

export { GridItem, GridContainer };