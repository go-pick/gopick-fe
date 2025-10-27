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
};

const darkTheme = {
	...commonTheme,
	background: basicColors.black,
	backgroundSub: '#2B2B2B',
	text: basicColors.white,
	textSub: grayColors.darken,
}

export { lightTheme, darkTheme };