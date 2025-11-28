import React, { useState } from 'react';
import CategorySelectModal from './components/CategorySelectModal';
import S from './Compare.styles';
import { GridContainer, GridItem } from '../../components/common/grid/Grid';
import SelectedProductsPanel from './components/SelectedProductsPanel';
import WeightConfigurator from './components/WeightConfigurator';
import WeightConfigPlaceholder from './components/WeightConfigPlaceholder';
import ProductSearchModal from './components/ProductSearchModal';

const ComparePage = () => {

    // 선택된 카테고리 정보 (예: { name: '스마트폰', slug: 'smartphone', ... })
    const [categoryInfo, setCategoryInfo] = useState(null);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

    // [수정 1] 더미 데이터 제거 -> 빈 배열로 시작
    const [selectedProducts, setSelectedProducts] = useState([]);

    // 카테고리 변경 (초기화)
    const handleResetCategory = () => {
        setCategoryInfo(null);
        setSelectedProducts([]);
    };

    const handleAddClick = () => {
        setIsSearchModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsSearchModalOpen(false);
    };

    // [수정 2] 모달에서 선택한 데이터 처리 로직 수정
    const handleSelectProduct = (product) => {
        // ProductSearchModal에서 넘겨주는 객체 구조:
        // { unique_id, product_id, name, variant_name, price, specs ... }
        
        // 이미 추가된 옵션인지 확인 (unique_id 기준)
        const isExist = selectedProducts.find(p => p.unique_id === product.unique_id);
        
        if (!isExist) {
            setSelectedProducts(prev => [...prev, product]);
        } else {
            alert("이미 추가된 제품입니다.");
        }
        
        // 선택 후 모달 닫기
        setIsSearchModalOpen(false);
    };

    // [수정 3] 제품 삭제 기능 (선택된 패널에서 X 누를 때 필요할 것 같아 추가)
    const handleRemoveProduct = (uniqueId) => {
        setSelectedProducts(prev => prev.filter(p => p.unique_id !== uniqueId));
    };

    const gridTemplate = "repeat(12, 1fr)";

    return (
        <S.PageContainer>
            {/* 카테고리 선택 모달 */}
            {!categoryInfo && (
                <CategorySelectModal onSelect={(selectedData) => setCategoryInfo(selectedData)} />
            )}

            {/* 제품 검색 모달 */}
            <ProductSearchModal 
                isOpen={isSearchModalOpen}
                onClose={handleCloseModal}
                onSelect={handleSelectProduct}
                // [중요 수정] 백엔드는 slug로 검색하므로 name 대신 slug를 전달해야 함
                // CategorySelectModal이 { name: '스마트폰', slug: 'smartphone' } 형태를 반환한다고 가정
                currentCategorySlug={categoryInfo?.slug} 
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
                        {selectedProducts.length < 2 ? (
                            <WeightConfigPlaceholder />
                        ) : (
                            <WeightConfigurator />
                        )}
                    </S.ContentListWrapper>
                </GridItem>
            </GridContainer>
        </S.PageContainer>
    );
};

export default ComparePage;