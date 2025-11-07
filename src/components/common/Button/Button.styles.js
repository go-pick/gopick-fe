import styled, { css } from "styled-components";

const solidStyles = css`
	color: #ffffff;
	background-color: ${({ theme }) => theme.main.regular};
	border: 2px solid ${({ theme }) => theme.main.regular};

	&:hover {
		background-color: ${({ theme }) => theme.main.darken};
		border-color: ${({ theme }) => theme.main.darken};
	}
`;

const outlineStyles = css`
	color: ${({ theme }) => theme.main.regular};
	background-color: transparent;
	border: 2px solid ${({ theme }) => theme.main.regular};

	&:hover {
		color: #ffffff;
		background-color: ${({theme}) => theme.main.regular};
	}
`;

const StyledButton = styled.button`
	width: ${({ width }) => width || '100%'};
	padding: 0.75rem 1rem;
	font-size: 1rem;
	cursor: pointer;

	border-radius: 30px;
	transition: all 0.2s ease-out;

	${({ variant }) => (variant === 'outline' ? outlineStyles : solidStyles)}

	&:disabled {
		cursor: not-allowed;
		opacity: 0.6;
	}
`;

export default StyledButton;