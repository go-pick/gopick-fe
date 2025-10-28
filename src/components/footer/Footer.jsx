import React from 'react';
import S from './Footer.styles';
import { Envelope } from 'react-bootstrap-icons';
import { useTheme } from 'styled-components';

const Footer = () => {
	const theme = useTheme();

	return (
		<S.FooterWrapper>
			<S.FooterTitle>Go를만해</S.FooterTitle>
			<S.Bar />
			<S.IconWrapper>
				<Envelope size={30} color={theme.main.regular} />
			</S.IconWrapper>
			<S.Desription>
				jungjune276@gmail.com
			</S.Desription>
		</S.FooterWrapper>
	);
};

export default Footer;