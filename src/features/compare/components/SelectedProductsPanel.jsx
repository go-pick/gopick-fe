import React, { useState } from 'react';
import S from '../Compare.styles';
import styled, { css } from 'styled-components';
import { XCircle } from 'react-bootstrap-icons';

const SelectedProductsPanel = ({ selectedCategory, selectedProducts, onAddClick, onRemoveClick }) => {
	const MAX_PRODUCTS = 4;
	const currentCount = selectedProducts.length;

	return (
		<div style={{minHeight: "70vh"}}>
			<S.SubTitle>{selectedCategory} 비교하기</S.SubTitle>
			<ProductListContainer>
				{selectedProducts.map((product) => (
					// [수정] key는 unique_id 사용
					<CardWrapper key={product.unique_id}>
						<ImageArea>
							{product.image_url ? (
								<img 
									src={product.image_url} 
									alt={product.name} 
									style={{width: '100%', height: '100%', objectFit: 'cover'}}
								/>
							) : (
								<CheckeredPlaceholder />
							)}
							
							{/* 삭제 버튼 추가 */}
							<DeleteBtn onClick={() => onRemoveClick(product.unique_id)}>
								<XCircle size={24} color="#ff6b6b" />
							</DeleteBtn>
						</ImageArea>
						
						<TextArea>
							{/* [수정] 제품명과 옵션명 함께 표시 */}
							<div className="main-name">{product.name}</div>
							<div className="variant-name">{product.variant_name}</div>
						</TextArea>
					</CardWrapper>
				))}

				{/* 추가 버튼 */}
				{currentCount < MAX_PRODUCTS && (
					<CardWrapper onClick={onAddClick}>
						<ImageArea isAddButton>
							+
						</ImageArea>
						<TextArea isAddButton>
							제품 추가하기
						</TextArea>
					</CardWrapper>
				)}
			</ProductListContainer>
		</div>
	);
};

export default SelectedProductsPanel;

const ProductListContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 24px;
	justify-content: center;
	margin-top: 20px;
`;

const CardWrapper = styled.div`
	width: 230px;
	height: 280px; // 텍스트 2줄을 위해 높이 약간 증가
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	cursor: default;
`;

const ImageArea = styled.div`
	width: 180px;
	height: 180px;
	border-radius: 16px;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
	background-color: #f8f9fa;
	position: relative; // 삭제 버튼 위치 기준

	${props => props.isAddButton && css`
		background-color: transparent;
		border: 2px dashed ${props.theme.gray?.regular || '#ccc'};
		color: ${props.theme.gray?.regular || '#ccc'};
		font-size: 3rem;
		font-weight: 300;
		cursor: pointer;
		transition: all 0.2s;

		&:hover {
			border-color: ${props.theme.gray.darken};
			color: ${props.theme.gray.darken};
			background-color: ${props.theme.backgroundSub};
		}
	`}
`;

const DeleteBtn = styled.button`
	position: absolute;
	top: 10px;
	right: 10px;
	background: white;
	border: none;
	border-radius: 50%;
	width: 30px;
	height: 30px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	box-shadow: 0 2px 5px rgba(0,0,0,0.1);
	opacity: 0.8;
	&:hover { opacity: 1; transform: scale(1.1); }
`;

const TextArea = styled.div`
	margin-top: 16px;
	text-align: center;
	font-size: 1.1rem;
	font-weight: 600;

	${props => props.isAddButton && css`
		color: #9ca3af;
		font-weight: 500;
	`}
`;

// [추가됨] 누락되었던 컴포넌트
const CheckeredPlaceholder = styled.div`
	width: 100%;
	height: 100%;
	opacity: 0.2;
	background-image: linear-gradient(45deg, #777 25%, transparent 25%), 
					linear-gradient(-45deg, #777 25%, transparent 25%), 
					linear-gradient(45deg, transparent 75%, #777 75%), 
					linear-gradient(-45deg, transparent 75%, #777 75%);
	background-size: 20px 20px;
	background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
`;
