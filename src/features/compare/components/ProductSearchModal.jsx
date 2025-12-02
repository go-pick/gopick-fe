import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { SearchBar } from '../../../components/common';
import { Check, ChevronLeft, X } from 'react-bootstrap-icons';
import { searchProducts, getProductVariants } from '../../../api/api';

const ProductSearchModal = ({ isOpen, onClose, onSelect, currentCategorySlug }) => {
	const [step, setStep] = useState('SEARCH');

	const [searchTerm, setSearchTerm] = useState('');

	const [products, setProducts] = useState([]); 
	const [selectedProduct, setSelectedProduct] = useState(null); 
	const [variants, setVariants] = useState([]);

	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!isOpen) {
			setStep('SEARCH');
			setSearchTerm('');
			setProducts([]);
			setSelectedProduct(null);
			setVariants([]);
		}
	}, [isOpen]);

	// 제품 검색
	useEffect(() => {
		if (step !== 'SEARCH' || !isOpen) return;

		const fetchList = async () => {
			setIsLoading(true);
			try {
				// API 함수 호출
				const data = await searchProducts(searchTerm, currentCategorySlug);
				setProducts(data);
			} catch (err) {
				// 에러 처리
			} finally {
				setIsLoading(false);
			}
		};

		const timer = setTimeout(fetchList, 400);
		return () => clearTimeout(timer);
	}, [searchTerm, isOpen, step, currentCategorySlug]);

    // 제품 클릭 핸들러
	const handleProductClick = async (product) => {
		setSelectedProduct(product);
		setIsLoading(true);
		try {
			// API 함수 호출
			const data = await getProductVariants(product.id);
			setVariants(data);
			setStep('VARIANT'); 
		} catch (err) {
			alert("옵션 정보를 불러오는데 실패했습니다.");
		} finally {
			setIsLoading(false);
		}
	};
    
	const handleBack = () => {
		setStep('SEARCH');
		setVariants([]);
		setSelectedProduct(null);
	};

	const handleVariantSelect = (variant) => {
		const mergedSpecs = {
			...(selectedProduct.specs || {}), 
			...(variant.option_specs || {})   
		};

		const finalData = {
			unique_id: variant.id,      
			product_id: selectedProduct.id,
			name: selectedProduct.name, 
			variant_name: variant.variant_name, 
			brand: selectedProduct.brand,
			image_url: selectedProduct.image_url,
			price: variant.price,
			
			// 병합된 스펙 객체를 전달
			specs: mergedSpecs 
		};

		onSelect(finalData);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<Overlay onClick={onClose}>
			<ModalContainer onClick={e => e.stopPropagation()}>
				{/* 헤더 */}
				<ModalHeader>
					{step === 'VARIANT' && (
						<BackButton onClick={handleBack}>
							<ChevronLeft size={24} color="white" />
						</BackButton>
					)}
					
					{step === 'SEARCH' ? (
						<SearchWrapper>
							<SearchBar onSearch={setSearchTerm} />
						</SearchWrapper>
					) : (
						<HeaderTitle>옵션 선택</HeaderTitle>
					)}

					<CloseButton onClick={onClose}>
						<X size={32} />
					</CloseButton>
				</ModalHeader>

				{/* 바디 */}
				<ModalBody>
					{isLoading ? (
						<LoadingState>불러오는 중...</LoadingState>
					) : (
						<>
							{/* STEP 1: 검색 결과 리스트 */}
							{step === 'SEARCH' && (
								<ProductGrid>
									{products.map(product => (
										<ProductCard key={product.id} onClick={() => handleProductClick(product)}>
											<CardImagePlaceholder>
												{product.image_url ? (
													<img src={product.image_url} style={{width: "220px", height: "220px"}} alt="" />
												) : <CheckeredPattern />}
											</CardImagePlaceholder>
											<CardInfo>
												<BrandName>{product.brand}</BrandName>
												<MainName>{product.name}</MainName>
											</CardInfo>
										</ProductCard>
									))}
									{products.length === 0 && searchTerm && (
										<EmptyState>검색 결과가 없습니다.</EmptyState>
									)}
								</ProductGrid>
							)}

							{/* STEP 2: 옵션 선택 리스트 */}
							{step === 'VARIANT' && selectedProduct && (
								<VariantContainer>
									<SelectedProductSummary>
										<SummaryImage>
											{selectedProduct.image_url ? (
												<img 
													src={selectedProduct.image_url} 
													alt={selectedProduct.name} 
												/>) : (
												<CheckeredPattern />
											)}
										</SummaryImage>
										<div>
											<BrandName>{selectedProduct.maker}</BrandName>
											<MainName style={{fontSize: '1.2rem'}}>{selectedProduct.name}</MainName>
										</div>
									</SelectedProductSummary>

									<SectionTitle>세부 옵션을 선택해주세요</SectionTitle>
									
									<VariantList>
										{variants.map(v => (
											<VariantItem key={v.id} onClick={() => handleVariantSelect(v)}>
												<VariantInfo>
													<VName>{v.variant_name}</VName>
													<VPrice>{v.price?.toLocaleString()}원</VPrice>
												</VariantInfo>
												<CheckIcon>
													<Check size={20} />
												</CheckIcon>
											</VariantItem>
										))}
									</VariantList>
								</VariantContainer>
							)}
						</>
					)}
				</ModalBody>
			</ModalContainer>
		</Overlay>
	);
};

export default ProductSearchModal;

/* --- Styled Components --- */

const LoadingState = styled.div` display: flex; justify-content: center; padding-top: 50px; color: #666; `;
const BrandName = styled.div` font-size: 0.8rem; color: ${({ theme }) => theme.textSub}; `;
const MainName = styled.div` font-size: 1rem; font-weight: 600; color: ${({ theme }) => theme.text}; `;
const CardInfo = styled.div` text-align: center; `;

const HeaderTitle = styled.div`
	color: white;
	font-size: 1.2rem;
	font-weight: 700;
`;

const BackButton = styled.button`
	position: absolute;
	left: 20px;
	background: none;
	border: none;
	cursor: pointer;
	display: flex;
	align-items: center;
`;

const VariantContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;
	padding: 10px;
`;

const SelectedProductSummary = styled.div`
	display: flex;
	align-items: center;
	gap: 16px;
	padding-bottom: 20px;
	border-bottom: 1px solid ${({ theme }) => theme.gray.regular};
`;

const SummaryImage = styled.div`
	width: 60px;
	height: 60px;
	border-radius: 8px;
	background: #f0f0f0;
	overflow: hidden;

	display: flex;
	align-items: center;
	justify-content: center;

	img {
		width: 100%;
		height: 100%;	
		object-fit: cover;
	}
`;

const SectionTitle = styled.div`
	font-size: 0.95rem;
	color: ${({ theme }) => theme.text};
	font-weight: 600;
`;

const VariantList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

const VariantItem = styled.button`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16px 20px;
	border: 1px solid ${({ theme }) => theme.gray.regular};
	border-radius: 12px;
	background: ${({ theme }) => theme.background};
	cursor: pointer;
	transition: all 0.2s;
	text-align: left;

	&:hover {
		border-color: ${({ theme }) => theme.main.regular};
		background-color: ${({ theme }) => theme.backgroundSub};
		transform: translateY(-2px);
		
		div:last-child {
			opacity: 1;
			color: ${({ theme }) => theme.main.regular};
		}
	}
`;

const VariantInfo = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
`;

const VName = styled.span`
	font-size: 1rem;
	font-weight: 600;
	color: ${({ theme }) => theme.text};
`;

const VPrice = styled.span`
	font-size: 0.9rem;
	color: ${({ theme }) => theme.textSub};
`;

const CheckIcon = styled.div`
	opacity: 0;
	transition: opacity 0.2s;
`;

const fadeIn = keyframes`
	from { opacity: 0; }
	to { opacity: 1; }
`;

const slideUp = keyframes`
	from { transform: translateY(20px); opacity: 0; }
	to { transform: translateY(0); opacity: 1; }
`;

const Overlay = styled.div`
	position: fixed;
	top: 0; left: 0; right: 0; bottom: 0;
	background-color: rgba(0, 0, 0, 0.6);
	z-index: 1000;
	display: flex;
	justify-content: center;
	align-items: center;
	animation: ${fadeIn} 0.2s ease-out;
`;

const ModalContainer = styled.div`
	width: 800px;
	height: 600px;
	background-color: ${({ theme }) => theme.background};
	border-radius: 24px;
	box-shadow: 0 10px 25px ${({ theme }) => theme.shadow};
	display: flex;
	flex-direction: column;
	overflow: hidden;
	animation: ${slideUp} 0.3s ease-out;
`;

const ModalHeader = styled.div`
	height: 100px;
	background-color: ${({ theme }) => theme.main.regular};
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	padding: 0 20px;
`;

const SearchWrapper = styled.div`
	width: 60%;
`;

const CloseButton = styled.button`
	position: absolute;
	right: 20px;
	top: 20px;
	background: none;
	border: none;
	color: white;
	cursor: pointer;
	opacity: 0.8;
	&:hover { opacity: 1; }
`;

const ModalBody = styled.div`
	flex: 1;
	padding: 30px;
	overflow-y: auto;
	background-color: ${({ theme }) => theme.background};

	&::-webkit-scrollbar {
		width: 8px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: ${({ theme }) => theme.backgroundSub};
		border-radius: 4px;
	}
`;

const ProductGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
	gap: 20px;
`;

const ProductCard = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	cursor: pointer;
	padding: 10px;
	border-radius: 12px;
	transition: all 0.2s;

	&:hover {
		background-color: ${({ theme }) => theme.backgroundSub};
		transform: translateY(-2px);
	}
`;

const CardImagePlaceholder = styled.div`
	width: 140px;
	height: 140px;
	border-radius: 12px;
	overflow: hidden;
	margin-bottom: 12px;
`;

const CheckeredPattern = styled.div`
	width: 100%;
	height: 100%;
	opacity: 0.3;
	background-image: linear-gradient(45deg, #bbb 25%, transparent 25%), 
					linear-gradient(-45deg, #bbb 25%, transparent 25%), 
					linear-gradient(45deg, transparent 75%, #bbb 75%), 
					linear-gradient(-45deg, transparent 75%, #bbb 75%);
	background-size: 20px 20px;
	background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
`;

const EmptyState = styled.div`
	text-align: center;
	padding-top: 50px;
`;