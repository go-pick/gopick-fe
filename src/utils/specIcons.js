import { ArrowsCollapse, AspectRatio, BatteryCharging, BatteryFull, BrightnessHigh, Cpu, Eye, GpuCard, Hdd, Hourglass, Laptop, LayersFill, Memory, Phone, QuestionCircle } from "react-bootstrap-icons";
import styled from "styled-components";

const KrwTextStyled = styled.span`
	font-size: 18px;
    font-weight: 800;
	color: ${({ theme }) => theme.icon};
	font-style: normal;
	line-height: 1;
`;

const ICON_MAP = {
	'default': <QuestionCircle />,
	'weight': <LayersFill />,
	'battery': <BatteryFull />,
	'charging': <BatteryCharging />,
	'phone_size': <Phone />,
	'laptop_size': <Laptop />,
	'screen': <AspectRatio />,
	'memory': <Memory />,
	'storage': <Hdd />,
	'brightness': <BrightnessHigh />,
	'battery_time': <Hourglass />,
	'refresh_rate': <Eye />,
	'cpu': <Cpu />,
	'gpu': <GpuCard />,
	'thickness': <ArrowsCollapse />,
	'price': <KrwTextStyled>KRW</KrwTextStyled>,
};

export const getSpecIcon = (key) => {
	if (!key) return ICON_MAP['default'];
    const normalizedKey = key.toLowerCase();
    return ICON_MAP[normalizedKey] || ICON_MAP['default'];
};