import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { InfoCircleFill } from 'react-bootstrap-icons'; // 부트스트랩 아이콘
import { getCategories } from '../../../api/api'; // API 경로 확인 필요
import { Button } from '../../../components/common';

const CategorySelectModal = ({ onSelect }) => {
	const [categories, setCategories] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	
	// 사용자가 임시로 선택한 값 (확인 버튼 누르기 전)
	const [tempSelected, setTempSelected] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
		setIsLoading(true);
		try {
			const data = await getCategories();
			console.log(data);
			if (Array.isArray(data)) {
				setCategories(data);
			} else {
				console.error("데이터가 배열이 아닙니다:", data);
				setCategories([]); // 안전하게 빈 배열 처리
				// setErrorMsg("데이터 형식이 올바르지 않습니다.");
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
		};
		fetchData();
	}, []);

	// 라디오 버튼 변경 핸들러 (임시 상태만 변경)
	const handleRadioChange = (categorySlug) => {
		setTempSelected(categorySlug);
	};

	// 확인 버튼 클릭 핸들러 (최종 확정)
	const handleConfirm = () => {
		if (tempSelected) {
			// 1. 현재 선택된 slug와 일치하는 전체 카테고리 객체를 찾는다.
			const selectedCategoryObj = categories.find(c => c.slug === tempSelected);

			if (selectedCategoryObj) {
				// 2. 부모에게 { slug, name } 형태로 전달
				onSelect({
					id: selectedCategoryObj.id,
					slug: selectedCategoryObj.slug,
					name: selectedCategoryObj.name,
					specs: selectedCategoryObj.specs,
				});
			}
		} else {
			alert("카테고리를 선택해주세요.");
		}
	};

	return (
		<Overlay>
		<ModalContainer>
			<ModalHeader>
			<h2>카테고리</h2>
			</ModalHeader>
			
			<ModalBody>
			{isLoading ? (
				<LoadingMessage>목록을 불러오고 있습니다...</LoadingMessage>
			) : (
				<RadioGroup>
				{ categories && categories.length > 0 ? categories.map((category) => (
					<RadioLabel key={category.id} isSelected={tempSelected === category.slug}>
					<RadioInput
						type="radio"
						name="category"
						value={category.slug}
						checked={tempSelected === category.slug}
						onChange={() => handleRadioChange(category.slug)}
					/>
					<CustomRadio />
					<LabelText>{category.name}</LabelText>
					</RadioLabel>
				)) : (
					<div>표시할 카테고리가 없습니다.</div>
				)}
				</RadioGroup>
			)}

			{/* 안내 메시지: 부트스트랩 아이콘 적용 */}
			<InfoMessage>
				<InfoIconWrapper>
				<InfoCircleFill size={16} />
				</InfoIconWrapper>
				<span>비교는 같은 카테고리의 제품끼리만 가능합니다.</span>
			</InfoMessage>
			</ModalBody>
			
			<ModalFooter>
			{/* 확인 버튼 추가 */}
			<Button
				onClick={handleConfirm} 
				disabled={!tempSelected || isLoading} // 선택 안했으면 비활성화
			>
				확인
			</Button>
			</ModalFooter>
		</ModalContainer>
		</Overlay>
	);
};

export default CategorySelectModal;

// --- Styled Components ---

const Overlay = styled.div`
	position: fixed;
	top: 0; left: 0; width: 100%; height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex; justify-content: center; align-items: center;
	z-index: 1000;
`;

const ModalContainer = styled.div`
	width: 300px;
	background-color: ${({ theme }) => theme.background};
	border-radius: 16px;
	overflow: hidden;
	box-shadow: 0 4px 20px ${({ theme }) => theme.shadow};
	display: flex;
	flex-direction: column;
`;

const ModalHeader = styled.div`
	background-color: ${({ theme }) => theme.main.regular}; /* 테마 컬러 적용 */
	padding: 20px;
	text-align: center;
	
	h2 {
		margin: 0;
		color: white;
		font-size: 1.4rem;
		font-weight: 700;
	}
`;

const ModalBody = styled.div`
	padding: 24px 20px;
	display: flex;
	flex-direction: column;
	gap: 20px;
	min-height: 200px;
`;

const RadioGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

const RadioLabel = styled.label`
	display: flex;
	align-items: center;
	cursor: pointer;
	padding: 10px 12px;
	border-radius: 8px;
	transition: background-color 0.2s;
	background-color: ${({ isSelected, theme }) => isSelected ? theme.backgroundSub : 'transparent'};
	
	&:hover {
		background-color: ${({ theme }) => theme.backgroundSub};
	}
`;

const RadioInput = styled.input`
  	display: none;
`;

const CustomRadio = styled.div`
	width: 20px; height: 20px;
	border: 2px solid #d1d5db;
	border-radius: 50%;
	margin-right: 12px;
	position: relative;
	flex-shrink: 0;

	${RadioInput}:checked + & {
		border-color: ${({ theme }) => theme.main.regular}; /* 테마 컬러 적용 */
		
		&::after {
			content: '';
			position: absolute;
			top: 50%; left: 50%;
			transform: translate(-50%, -50%);
			width: 10px; height: 10px;
			background-color: ${({ theme }) => theme.main.regular}; /* 테마 컬러 적용 */
			border-radius: 50%;
		}
  }
`;

const LabelText = styled.span`
	font-size: 1rem;
	color: ${({ theme }) => theme.text};
	font-weight: 500;
`;

const InfoMessage = styled.div`
	display: flex;
	align-items: flex-start; 
	gap: 8px;
	font-size: 0.85rem;
	color: ${({ theme }) => theme.textSub};
	margin-top: auto;
	line-height: 1.4;
	border: 2px solid ${({ theme }) => theme.backgroundSub};
	padding: 12px;
	border-radius: 8px;
`;

const InfoIconWrapper = styled.div`
	color: ${({ theme }) => theme.sub};
	display: flex;
	align-items: center;
	margin-top: 2px;
`;

const ModalFooter = styled.div`
	padding: 0 20px 24px 20px;
`;

const LoadingMessage = styled.div`
	text-align: center;
	color: ${({ theme }) => theme.textSub};
	padding: 40px 0;
`;