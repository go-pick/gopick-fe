import React, { useEffect, useState } from 'react';
import CategorySelectModal from './components/CategorySelectModal';
import S from './Compare.styles';
import { GridContainer, GridItem } from '../../components/common/grid/Grid';
import SelectedProductsPanel from './components/SelectedProductsPanel';
import WeightConfigurator from './components/WeightConfigurator';
import WeightConfigPlaceholder from './components/WeightConfigPlaceholder';
import ProductSearchModal from './components/ProductSearchModal';
import { useNavigate } from 'react-router-dom';
import { calculateRanking } from '../../api/api';
import { Button } from '../../components/common';
import { head } from 'lodash';
import { useAuth } from '../../contexts/AuthContext';

const ComparePage = () => {
	const navigate = useNavigate();
	const { session } = useAuth();

	const [categoryInfo, setCategoryInfo] = useState(null);
	const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

	const [selectedProducts, setSelectedProducts] = useState([]);
	const [weights, setWeights] = useState({});

	const [isLoading, setIsLoading] = useState(false);

	// 카테고리 변경 (초기화)
	const handleCategorySelect = (selectedData) => {
		const priceSpecDefinition = {
            eng_name: 'price', 
            kor_name: '가격',
            unit: '₩',
            is_positive: false
        };

		const mergedSpecs = [priceSpecDefinition, ...selectedData.specs];
        setCategoryInfo({
            ...selectedData,
            specs: mergedSpecs
        });
        setSelectedProducts([]); // 초기화
        setWeights({});
    };

	const handleAddClick = () => {
		setIsSearchModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsSearchModalOpen(false);
	};

    //모달에서 선택한 데이터 처리 로직 수정
	const handleSelectProduct = (product) => {
        const isExist = selectedProducts.find(p => p.unique_id === product.unique_id);
        if (isExist) {
            alert("이미 추가된 제품입니다.");
            return;
        }
        setSelectedProducts(prev => [...prev, product]);
        setIsSearchModalOpen(false);
    };
	

    // 제품 삭제 기능
	const handleRemoveProduct = (uniqueId) => {
		setSelectedProducts(prev => prev.filter(p => p.unique_id !== uniqueId));
	};

	const handleCompareStart = async () => {
        // 유효성 검사
        if (selectedProducts.length < 2) {
            alert("최소 2개 이상의 제품을 선택해야 비교할 수 있습니다.");
            return;
        }

        setIsLoading(true);

        try {
            // 백엔드로 보낼 데이터 준비
            const payload = {
                categoryId: categoryInfo.id, // 카테고리 ID (스펙 정의 조회용)
                selectedVariantIds: selectedProducts.map(p => p.unique_id), // 제품 ID들
                weights: weights // 사용자가 설정한 가중치
            };
			
            // API 호출 (계산 요청)
            const { rankedData, specDefinitions } = await calculateRanking(payload, session?.access_token);
            
            // 성공 시 결과 페이지로 이동
            // state에 데이터를 담아 보내면 URL이 지저분해지지 않고 데이터만 전달됩니다.
            navigate('/compare/result', { 
                state: { 
                    rankedData: rankedData,
                    specDefinitions: specDefinitions,
					weights: weights
                } 
            });

        } catch (error) {
            console.error("비교 계산 실패:", error);
            alert("점수 산출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        } finally {
            // 6. 로딩 종료
            setIsLoading(false);
        }
    };

	const gridTemplate = "repeat(12, 1fr)";
	const isConfigurable = selectedProducts.length >= 2;

	return (
		<S.PageContainer>
			{/* 카테고리 선택 모달 */}
			{!categoryInfo && (
				<CategorySelectModal onSelect={handleCategorySelect} />
			)}

			{/* 제품 검색 모달 */}
			<ProductSearchModal 
				isOpen={isSearchModalOpen}
				onClose={handleCloseModal}
				onSelect={handleSelectProduct}
				currentCategorySlug={categoryInfo?.slug} // { name: '스마트폰', slug: 'smartphone', id: '~~' }
			/>

			<GridContainer gtc={gridTemplate} gap="40px">
				{/* 왼쪽: 선택된 제품 목록 */}
				<GridItem colStart={2} colSpan={5} align="flex-start">
					<S.StickySidebarWrapper>
						<SelectedProductsPanel
							selectedCategory={categoryInfo?.name}
							selectedProducts={selectedProducts} 
							onAddClick={handleAddClick}
							onRemoveClick={handleRemoveProduct} // 삭제 핸들러 전달
						/>
					</S.StickySidebarWrapper>
				</GridItem>

				{/* 오른쪽: 가중치 설정 */}
				<GridItem colStart={7} colSpan={5} align="flex-start">
					<S.ContentListWrapper>
						<S.SubTitle>당신이 중요하게 생각하는 것은?</S.SubTitle>
						{selectedProducts.length < 2 ? (
							<WeightConfigPlaceholder />
						) : (
							<WeightConfigurator 
								specDefinitions={categoryInfo?.specs || []} 
								onWeightChange={setWeights}
							/>
						)}
					</S.ContentListWrapper>
					<div style={{height: "2rem"}}></div>
					<Button
						onClick={handleCompareStart}
						disabled={!isConfigurable || isLoading}
						variant='solid'
						style={{height: '4rem'}}
					>
						비교하기
					</Button>
				</GridItem>
			</GridContainer>
		</S.PageContainer>
    );
};

export default ComparePage;