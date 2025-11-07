import styled from "styled-components";

const InputWrapper = styled.div`
	position: relative;
	margin: 1.5rem 0.5rem 0.5rem 0.5rem;
	width: ${({ width }) => width || '100%'};
	min-width: 10rem;
`;

const StyledLabel = styled.label`
	position: absolute;
	top: 10px;
	left: 5px;
	font-size: 1rem;
	color: ${({ theme }) => theme.textSub};
	pointer-events: none;
	transition: all 0.2s ease-out;
`;

const StyledInput = styled.input`
	padding: 10px 5px;
	font-size: 1rem;
	background-color: transparent;
	width: 100%;

	color: ${({ theme }) => theme.text};
	border: none;
	border-bottom: 2px solid ${({ theme }) => theme.textBox};
	transition: border-bottom-color 0.2s ease-out;
	
	&:focus {
		outline: none;
		border-bottom-color: ${({ theme }) => theme.main.regular};
	}
	
	&:focus + ${StyledLabel},
	&:not(:placeholder-shown) + ${StyledLabel} {
		top: -1rem;
		font-size: 0.75rem;
	}
	
	&:focus + ${StyledLabel} {
		color: ${({ theme }) => theme.main.regular};
	}

	&::placeholder {
		color: transparent;
	}
`;

export { InputWrapper, StyledInput, StyledLabel };