import React from 'react';
import { Caption, InputWrapper, StyledInput, StyledLabel } from './TextBox.styles';

const TextBox = React.forwardRef(({ label, id, width, caption, status='default', ...rest }, ref) => {
	
	// id가 없을 시 자동 생성
	const inputId = id || `textbox-${label.replace(/\s+/g, '-').toLowerCase()}`;
	
	return (
		<InputWrapper width={width}>
			<StyledInput
				id={inputId}
				placeholder=''
				ref={ref}
				{...rest}
			/>
			<StyledLabel htmlFor={inputId}>
				{label}
			</StyledLabel>
			{caption && (
				<Caption $status={status}>
					{caption}
				</Caption>
			)}
		</InputWrapper>
	);
});

export default TextBox;