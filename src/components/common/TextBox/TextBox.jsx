import React from 'react';
import { InputWrapper, StyledInput, StyledLabel } from './TextBox.styles';

const TextBox = ({ label, id, width, ...rest }) => {

	// id가 없을 시 자동 생성
	const inputId = id || `textbox-${label.replace(/\s+/g, '-').toLowerCase()}`;
	
	return (
		<InputWrapper width={width}>
			<StyledInput
				id={inputId}
				placeholder=''
				{...rest}
			/>
			<StyledLabel htmlFor='inputId'>
				{label}
			</StyledLabel>
		</InputWrapper>
	);
};

export default TextBox;