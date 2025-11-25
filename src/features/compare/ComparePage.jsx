import React, { useState } from 'react';
import CategorySelectModal from './components/CategorySelectModal';
import S from './Compare.styles';
import { GridContainer, GridItem } from '../../components/common/grid/Grid';
import SelectedProductsPanel from './components/SelectedProductsPanel';
import WeightConfigurator from './components/WeightConfigurator';

const ComparePage = () => {

	// 선택된 카테고리 Slug 저장 (null이면 모달이 뜸)
	const [selectedCategory, setSelectedCategory] = useState(null);

	// 모달에서 [확인] 버튼 클릭 시 호출됨
	const handleCategorySelect = (categorySlug) => {
		console.log(`선택된 카테고리: ${categorySlug}`);
		setSelectedCategory(categorySlug);
		
		// TODO: 이후 여기서 categorySlug를 이용해 서버에서 제품 리스트를 가져오는 로직이 추가됩니다.
	};

	// 카테고리 변경 (다시 모달 띄우기)
	const handleResetCategory = () => {
		setSelectedCategory(null);
	};

	const gridTemplate = "repeat(12, 1fr)";

	return (
		<S.PageContainer>
			{!selectedCategory && (
				<CategorySelectModal onSelectCategory={handleCategorySelect} />
			)}
			<GridContainer gtc={gridTemplate} gap="40px">
				<GridItem
					colStart={2}
					colSpan={5}
					align="flex-start"
				>
					<S.StickySidebarWrapper>
						<SelectedProductsPanel />
					</S.StickySidebarWrapper>
				</GridItem>
				<GridItem
					colStart={7}
					colSpan={5}
					align="flex-start"
				>
					<S.ContentListWrapper>
						<WeightConfigurator />
					</S.ContentListWrapper>
				</GridItem>
			</GridContainer>
		</S.PageContainer>
	);
};

export default ComparePage;