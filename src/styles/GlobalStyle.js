import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyle = createGlobalStyle`
	${reset}

	*, *::before, *::after {
		box-sizing: border-box;
	}

	body {
		font-family: 'Inter';
		line-height: 1.5;

		background-color: ${({ theme }) => theme.background};	
		color: ${({ theme }) => theme.text};

		transition: background-color 0.2s, color 0.2s;
	}

	a {
		color: inherit;
		text-decoration: none;
	}

	button {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		color: inherit;
	}

	input, text-area {
		font-family: inherit;
	}

`;

export default GlobalStyle;