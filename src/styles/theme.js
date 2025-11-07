import { basicColors, grayColors, mainColors, semanticColors, subColor, thdColor } from "./colors";

const commonTheme = {
	main: mainColors,
	gray: grayColors,
	semantic: semanticColors,
	sub: subColor,
	third: thdColor,
}

const lightTheme = {
	...commonTheme,
	background: basicColors.white,
	backgroundSub: '#ECF0F7',
	text: basicColors.black,
	textSub: grayColors.regular,
	textBox: '#202020',
	shadow: 'rgba(0, 0, 0, 0.15)',
};

const darkTheme = {
	...commonTheme,
	background: basicColors.black,
	backgroundSub: '#2B2B2B',
	text: basicColors.white,
	textSub: grayColors.darken,
	textBox: '#ffffff',
	shadow: 'rgba(255, 255, 255, 0.1)',
}

export { lightTheme, darkTheme };