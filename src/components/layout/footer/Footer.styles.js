import styled from "styled-components";

const S = {};

S.FooterWrapper = styled.footer`
	background-color: #2D2D2D;
	height: 300px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-top: 10px;
`;

S.FooterTitle = styled.div`
    color: #ffffff;
    font-weight: bold;
    font-size: 3em;
    margin: 0 1rem 0 5rem;
`;

S.Bar = styled.div`
    width: 5px;
    height: 50%;
    background-color: #ffffff;
    margin: 2rem;
`;

S.IconWrapper = styled.div`
    margin: 1rem;
    padding-top: 5px;
`;

S.Desription = styled.div`
    color: #ffffff;
    font-size: 1rem;
`;


export default S;