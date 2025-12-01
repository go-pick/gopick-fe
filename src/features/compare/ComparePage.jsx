import React, { useEffect, useState } from 'react';
import CategorySelectModal from './components/CategorySelectModal';
import S from './Compare.styles';
import { GridContainer, GridItem } from '../../components/common/grid/Grid';
import SelectedProductsPanel from './components/SelectedProductsPanel';
import WeightConfigurator from './components/WeightConfigurator';
import WeightConfigPlaceholder from './components/WeightConfigPlaceholder';
import ProductSearchModal from './components/ProductSearchModal';
import { useNavigate } from 'react-router-dom';

const ComparePage = () => {
	const navigate = useNavigate();

	const [categoryInfo, setCategoryInfo] = useState(null);
	const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

	const [selectedProducts, setSelectedProducts] = useState([]);
	const [weights, setWeights] = useState({});

	// 카테고리 변경 (초기화)
	const handleCategorySelect = (selectedData) => {
        setCategoryInfo(selectedData);
        setSelectedProducts([]); // 초기화
        setWeights({});
    };

	const handleAddClick = () => {
		setIsSearchModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsSearchModalOpen(false);
	};

    // [수정 2] 모달에서 선택한 데이터 처리 로직 수정
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

	const handleCompareStart = () => {
        if (selectedProducts.length < 2) {
            alert("최소 2개 이상의 제품을 선택해야 비교할 수 있습니다.");
            return;
        }

        // [페이지 이동] 모은 데이터를 가지고 결과 페이지로 이동
        navigate('/compare/result', { 
            state: { 
                products: selectedProducts, 
                weights: weights,
                specDefinitions: categoryInfo.specs // 계산에 필요한 공식(unit, is_positive 등) 전달
            } 
        });
    };

	const gridTemplate = "repeat(12, 1fr)";

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
				</GridItem>
			</GridContainer>
		</S.PageContainer>
    );
};

export default ComparePage;