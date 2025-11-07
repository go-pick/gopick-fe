import styled from 'styled-components';

// 1. 스타일 컴포넌트 정의
const SearchContainer = styled.div`
	display: flex;
	align-items: center;
	background-color: ${({ theme }) => theme.main.darken};
	border-radius: 30px;
	padding: 8px 28px;
	width: 100%;
	max-width: 400px;
	height: 48px;
	box-sizing: border-box;
`;

const SearchInput = styled.input`
	flex-grow: 1;
	background: transparent;
	border: none;
	outline: none;
	color: #FFFFFF;
	font-size: 16px;
	padding: 0;

	&::placeholder {
		color: rgba(255, 255, 255, 0.7);
	}
`;

const SearchButton = styled.button`
	background: none;
	border: none;
	outline: none;
	cursor: pointer;
	margin-left: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0;
	color: #FFFFFF;
`;

export { SearchContainer, SearchInput, SearchButton };