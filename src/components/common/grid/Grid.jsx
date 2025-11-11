import styled from "styled-components";

const GridContainer = styled.div`
    display: grid;
    padding: 0 20px;
    grid-template-columns: repeat(12, 1fr); /* 12개의 동일한 너비의 컬럼 */
    gap: 16px; /* 컬럼 사이의 간격 (0으로 설정 가능) */
    width: 100%;
    height: 100%;
`;

const GridItem = styled.div`
    /* colStart: 아이템이 시작할 컬럼 번호 (1 ~ 12) */
    grid-column-start: ${props => props.colStart};

    /* colSpan: 아이템이 차지할 컬럼 개수 (기본값 1) */
    grid-column-end: span ${props => props.colSpan || 1};

    display: flex;
    justify-content: center; /* 가로 중앙 정렬 */
    align-items: center;
    height: 100%;

    /* transition: all 0.3s ease-out; */
`;

export { GridItem, GridContainer };