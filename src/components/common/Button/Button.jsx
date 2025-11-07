import React from 'react';
import StyledButton from './Button.styles';

const Button = ({ children, variant = 'outline', width, ...rest }) => {
	return (
		<StyledButton variant={variant} width={width} {...rest}>
			{children}
		</StyledButton>
	);
};

export default Button;