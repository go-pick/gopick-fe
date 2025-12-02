import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DashCircle, Plus, Star, StarFill, CaretLeftFill } from 'react-bootstrap-icons';

const WeightConfigurator = ({ specDefinitions = [], onWeightChange }) => {

	const [activeSpecKeys, setActiveSpecKeys] = useState([]);
	const [weights, setWeights] = useState({});

	const [isOpen, setIsOpen] = useState(false);

    // 초기화 로직
	useEffect(() => {
		if (specDefinitions.length > 0 && activeSpecKeys.length === 0) {
			const initials = specDefinitions.slice(0, 4).map(s => s.eng_name);
			setActiveSpecKeys(initials);
			
			const initialWeights = {};
			initials.forEach(key => initialWeights[key] = 3);
			setWeights(initialWeights);
			onWeightChange(initialWeights);
		}
	}, [specDefinitions]);

	const handleRate = (specKey, score) => {
		const newWeights = { ...weights, [specKey]: score };
		setWeights(newWeights);
		onWeightChange(newWeights);
	};

	const handleRemoveSpec = (specKey) => {
		setActiveSpecKeys(prev => prev.filter(key => key !== specKey));
		const newWeights = { ...weights };
		delete newWeights[specKey];
		setWeights(newWeights);
		onWeightChange(newWeights);
	};

    const handleAddSpec = (specKey) => {
		setActiveSpecKeys(prev => [...prev, specKey]);
		const newWeights = { ...weights, [specKey]: 3 };
		setWeights(newWeights);
		onWeightChange(newWeights);
    };

    const activeSpecsList = activeSpecKeys.map(key => 
        specDefinitions.find(s => s.eng_name === key)
    ).filter(Boolean);

    const addableSpecs = specDefinitions.filter(s => !activeSpecKeys.includes(s.eng_name));

    return (
        <Container>
            {/* 상단 선택된 스펙 리스트 */}
            <SelectedList>
                {activeSpecsList.map((spec) => (
                    <ListItem key={spec.eng_name}>
                        <RemoveBtn onClick={() => handleRemoveSpec(spec.eng_name)}>
                            <DashCircle />
                        </RemoveBtn>
                        
                        <Label>
                            {spec.kor_name} 
                            {spec.unit && <Unit>{spec.unit}</Unit>}
                        </Label>
                        
                        <StarContainer>
                            {[1, 2, 3, 4, 5].map((num) => (
                                <StarIcon 
                                    key={num} 
                                    onClick={() => handleRate(spec.eng_name, num)}
                                    $active={num <= (weights[spec.eng_name] || 0)}
                                >
                                    {num <= (weights[spec.eng_name] || 0) ? <StarFill /> : <Star />}
                                </StarIcon>
                            ))}
                        </StarContainer>
                    </ListItem>
                ))}
            </SelectedList>

            {/* 하단 아코디언 액션 섹션 */}
            <BottomSection>
                <ToggleHeader onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen}>
                    <span>비교할 스펙 추가하기</span>
                    <IconWrapper $isOpen={isOpen}>
                        <CaretLeftFill />
                    </IconWrapper>
                </ToggleHeader>

                <DrawerContainer $isOpen={isOpen}>
                    <DrawerList>
                        {addableSpecs.length > 0 ? (
                            addableSpecs.map(spec => (
                                <DrawerItem key={spec.eng_name} onClick={() => handleAddSpec(spec.eng_name)}>
                                    <div className="text-group">
                                        <span className="name">{spec.kor_name}</span>
                                        {spec.unit && <span className="unit">{spec.unit}</span>}
                                    </div>
                                    <Plus size={22} className="add-icon"/>
                                </DrawerItem>
                            ))
                        ) : (
                            <EmptyMsg>모든 항목이 추가되었습니다.</EmptyMsg>
                        )}
                    </DrawerList>
                </DrawerContainer>
            </BottomSection>
        </Container>
    );
};

export default WeightConfigurator;

/* --- Styled Components --- */

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

// 상단 리스트 영역
const SelectedList = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 10px 20px 20px 20px; 

    /* 스크롤바 커스텀 */
    /* &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-thumb { 
        background-color: ${({ theme }) => theme.gray.regular}; 
        border-radius: 4px; 
    } */
`;

const ListItem = styled.div`
    display: flex; 
    align-items: center; 
    gap: 12px;
    padding: 0.7rem 0.5rem;
`;

const RemoveBtn = styled.button`
    background: none;
    border: none; 
    padding: 0; 
    color: #ff6b6b;
    cursor: pointer; 
    display: flex;
    
    svg { font-size: 18px; } 
    &:hover { color: #fa5252; }
`;

const Label = styled.span` 
    flex: 1; 
    font-size: 1rem; 
    color: ${({ theme }) => theme.text}; 
    font-weight: 500;
    display: flex; 
    align-items: center; 
    gap: 6px;
	padding: 0 0.5rem;
`;

const Unit = styled.span` 
	font-size: 11px; 
	color: ${({ theme }) => theme.textSub}; 
	background-color: ${({ theme }) => theme.backgroundSub}; // 배경색 추가
	padding: 2px 6px; // 안쪽 여백
	border-radius: 4px; // 둥근 모서리
	font-weight: 400;
`;

const StarContainer = styled.div` display: flex; gap: 6px; `;

const StarIcon = styled.div` 
    cursor: pointer;
    display: flex;
    
    svg { 
        font-size: 19px; 
        color: ${props => props.$active ? props.theme.third : props.theme.textSub}; 
        transition: all 0.2s;
    }
    
    &:hover svg { transform: scale(1.15); }
`;

// 하단 섹션 (아코디언)
const BottomSection = styled.div`
    border-top: 1px solid ${({ theme }) => theme.gray.regular};
    background-color: ${({ theme }) => theme.background}; 
`;

const ToggleHeader = styled.button`
    width: 100%;
    padding: 18px 20px;
    background: transparent;
    border: none;
    cursor: pointer;
    
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background 0.2s;

    span {
        font-size: 1rem;
        color: ${({ theme }) => theme.text};
        font-weight: 4
		00;
    }

    &:hover {
        background-color: ${({ theme }) => theme.backgroundSub};
    }
`;

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.text};
    font-size: 14px;
    
    /* 회전 애니메이션 */
    transform: ${props => props.$isOpen ? 'rotate(-90deg)' : 'rotate(0deg)'};
    transition: transform 0.4s ease;
`;

const DrawerContainer = styled.div`
    overflow: hidden;
    /* 높이 애니메이션 */
    max-height: ${props => props.$isOpen ? '1000px' : '0'};
    opacity: ${props => props.$isOpen ? '1' : '0'};
    transition: all 0.4s ease-in-out;
    
    background-color: ${({ theme }) => theme.background};
    border-top: ${props => props.$isOpen ? `1px solid ${props.theme.gray.regular}` : 'none'};
`;

const DrawerList = styled.div`
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
	height: auto;
    
    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-thumb { 
        background-color: ${({ theme }) => theme.gray.darken}; 
        border-radius: 4px; 
    }
`;

const DrawerItem = styled.button`
    width: 100%;
    text-align: left;
    padding: 12px 16px;
    background: ${({ theme }) => theme.background};
    border-radius: 8px;
    cursor: pointer;
    
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.2s;

    .text-group {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .name { 
        font-size: 15px; 
        color: ${({ theme }) => theme.text}; 
        font-weight: 500; 
    }
    
    .unit { 
        font-size: 11px; 
        color: ${({ theme }) => theme.textSub}; 
        background: ${({ theme }) => theme.backgroundSub}; 
        padding: 2px 6px; 
        border-radius: 4px; 
    }
    
    .add-icon { 
        color: ${({ theme }) => theme.main.regular}; 
        transition: color 0.2s; 
    }

    &:hover {
        background-color: ${({ theme }) => theme.backgroundSub};
    }
`;

const EmptyMsg = styled.div`
    text-align: center;
    padding: 20px;
    color: ${({ theme }) => theme.textSub};
    font-size: 13px;
`;