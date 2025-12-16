import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchProducts } from '../../api/api';
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';
import { GridContainer, GridItem } from '../../components/common/grid/Grid'; 

const ITEMS_PER_PAGE = 20;

const CATEGORIES = [
    { id: 'all', label: '전체' },
    { id: 'laptop', label: '노트북' },
    { id: 'tablet', label: '태블릿' },
    { id: 'phone', label: '핸드폰' },
    { id: 'watch', label: '스마트워치' },
];

const SearchResultPage = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const query = searchParams.get('q') || ''; 

	const [products, setProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedCategories, setSelectedCategories] = useState(['all']);

	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		const fetchList = async () => {
			if (!query) return;
			setIsLoading(true);
			try {
				let categoryParam = '';
				if (!selectedCategories.includes('all')) {
					categoryParam = selectedCategories.join(',');
				}

				const data = await searchProducts(query, categoryParam);
				setProducts(data);
				setCurrentPage(1);
			} catch (err) {
				console.error(err);
			} finally {
				setIsLoading(false);
			}
		};
		fetchList();
	}, [query, selectedCategories]);

	// --- 페이지네이션 계산 로직 ---
    // 1. 전체 아이템 수
    const totalItems = products.length;
    // 2. 전체 페이지 수 계산
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    
    // 3. 현재 페이지에 보여줄 데이터 자르기 (Slicing)
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

	const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0); // 페이지 이동 시 상단으로 스크롤
    };
    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handleCategoryCheck = (id) => {
        if (id === 'all') {
            setSelectedCategories(['all']);
        } else {
            let newCats = selectedCategories.filter(c => c !== 'all');
            if (newCats.includes(id)) {
                newCats = newCats.filter(c => c !== id);
            } else {
                newCats.push(id);
            }
            if (newCats.length === 0) newCats = ['all'];
            setSelectedCategories(newCats);
        }
    };

    return (
        <PageWrapper>
            {/* 상단 제목 영역 (그리드와 별도로 배치하거나 그리드 안에 넣을 수도 있음) */}
            <HeaderSection>
                <SearchTitle>
                    <Highlight>{query}</Highlight>에 대한 검색 결과
                </SearchTitle>
            </HeaderSection>

            <GridContainer gap="2rem">
                <GridItem colStart={2} colSpan={1} align="flex-start">
                    <SidebarContent>
                        <FilterBox>
                            <FilterTitle>카테고리</FilterTitle>
                            <CheckboxList>
                                {CATEGORIES.map(cat => (
                                    <CheckboxItem key={cat.id}>
                                        <CustomCheckbox 
											id={cat.id} 
											checked={selectedCategories.includes(cat.id)}
											onChange={() => handleCategoryCheck(cat.id)}
										/>
                                        <label htmlFor={cat.id}>{cat.label}</label>
                                    </CheckboxItem>
                                ))}
                            </CheckboxList>
                        </FilterBox>
                    </SidebarContent>
                </GridItem>
                <GridItem colStart={3} colSpan={9} align="flex-start">
                    <MainContentWrapper>
                        {isLoading ? (
                            <StatusMessage>검색 결과를 불러오는 중입니다...</StatusMessage>
                        ) : products.length > 0 ? (
                            <>
                                <ProductGrid>
                                    {products.map(product => (
                                        <ProductCard key={product.id} onClick={() => handleProductClick(product.id)}>
                                            <CardImagePlaceholder>
                                                {product.image_url ? (
                                                    <img src={product.image_url} alt={product.name} />
                                                ) : <CheckeredPattern />}
                                            </CardImagePlaceholder>
                                            <CardInfo>
                                                <BrandName>{product.brand}</BrandName>
                                                <MainName>{product.name}</MainName>
                                                {product.price && <Price>{product.price.toLocaleString()}원</Price>}
                                            </CardInfo>
                                        </ProductCard>
                                    ))}
                                </ProductGrid>
                                
                               {totalItems > ITEMS_PER_PAGE && (
                                    <Pagination>
                                        <PageBtn 
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft />
                                        </PageBtn>
                                        
                                        {/* 페이지 번호 버튼 생성 */}
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                            <PageBtn 
                                                key={number} 
                                                $active={currentPage === number}
                                                onClick={() => handlePageChange(number)}
                                            >
                                                {number}
                                            </PageBtn>
                                        ))}

                                        <PageBtn 
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            <ChevronRight />
                                        </PageBtn>
                                    </Pagination>
                                )}
                            </>
                        ) : (
                            <StatusMessage>
                                '{query}'에 대한 검색 결과가 없습니다.
                            </StatusMessage>
                        )}
                    </MainContentWrapper>
                </GridItem>
            </GridContainer>
        </PageWrapper>
    );
};

export default SearchResultPage;

/* --- Styled Components --- */

const PageWrapper = styled.div`
	width: 100%;
	padding-top: 40px;
	padding-bottom: 80px;
`;

const HeaderSection = styled.div`
	text-align: center;
	margin-bottom: 60px;
`;

const SearchTitle = styled.h1`
    font-size: 2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.text};
`;

const Highlight = styled.span`
    
`;

const SidebarContent = styled.div`
	width: 100%;
	min-width: 120px; 
`;

const MainContentWrapper = styled.div`
	width: 100%;
`;

const FilterBox = styled.div`
	border: 1px solid ${({ theme }) => theme.gray.regular};
	border-radius: 12px;
	overflow: hidden;
`;

const FilterTitle = styled.div`
	padding: 12px 16px;
	font-weight: 700;
	font-size: 0.95rem;
	border-bottom: 1px solid ${({ theme }) => theme.gray.regular};
	background-color: transparent;
`;

const CheckboxList = styled.div`
	padding: 12px 16px;
	display: flex;
	flex-direction: column;
	gap: 10px;
`;

const CheckboxItem = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;

	label {
		font-size: 0.9rem;
		cursor: pointer;
		color: ${({ theme }) => theme.text};
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
`;

const CustomCheckbox = styled.input.attrs({ type: 'checkbox' })`
	appearance: none;
	-webkit-appearance: none; 
	width: 18px;
	height: 18px;
	border: 1px solid ${({ theme }) => theme.gray.regular};
	border-radius: 4px;
	background-color: transparent;
	cursor: pointer;
	transition: all 0.2s ease-in-out;
	position: relative;

	/* 3. 체크되지 않았을 때 (Hover 효과) */
	&:hover {
		border-color: ${({ theme }) => theme.main.regular};
		background-color: transparent;
	}

	/* 4. 체크되었을 때 스타일 */
	&:checked {
		background-color: ${({ theme }) => theme.main.regular}; /* 메인 색상으로 채움 */
		border-color: ${({ theme }) => theme.main.regular};
		
		/* 체크 표시 아이콘 (SVG 사용) */
		background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
		background-size: 100% 100%;
		background-position: center;
		background-repeat: no-repeat;
	}

	/* 5. 포커스 되었을 때 (접근성) */
	&:focus {
		outline: none;
	}
`;

const ProductGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr); 
    gap: 3rem;
    margin-bottom: 60px;

	border: 1px solid ${({ theme }) => theme.gray.regular};
	border-radius: 30px;
	padding: 3rem;

    @media (max-width: 1200px) {
        grid-template-columns: repeat(3, 1fr);
    }
    @media (max-width: 900px) {
        grid-template-columns: repeat(2, 1fr);
    }
`;

const ProductCard = styled.div`
    display: flex;
    flex-direction: column;
    cursor: pointer;
    transition: transform 0.2s;
`;

const CardImagePlaceholder = styled.div`
    width: 100%;
    aspect-ratio: 1;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 12px;
	
	img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

const CheckeredPattern = styled.div`
    width: 100%;
    height: 100%;
    opacity: 0.3;
    background-image: linear-gradient(45deg, #ccc 25%, transparent 25%), 
                    linear-gradient(-45deg, #ccc 25%, transparent 25%), 
                    linear-gradient(45deg, transparent 75%, #ccc 75%), 
                    linear-gradient(-45deg, transparent 75%, #ccc 75%);
    background-size: 20px 20px;
    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
`;

const CardInfo = styled.div`
    text-align: left;
    padding: 0 2px;
`;

const BrandName = styled.div`
    font-size: 0.8rem;
    color: ${({ theme }) => theme.textSub};
    margin-bottom: 4px;
`;

const MainName = styled.div`
    font-size: 0.95rem;
    font-weight: 600;
    color: ${({ theme }) => theme.text};
    line-height: 1.3;
    margin-bottom: 6px;
    
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

const Price = styled.div`
    font-size: 1rem;
    font-weight: 700;
    color: ${({ theme }) => theme.text};
`;

const StatusMessage = styled.div`
    text-align: center;
    padding: 100px 0;
    color: #888;
    font-size: 1.1rem;
    width: 100%;
`;

const Pagination = styled.div`
    display: flex;
    justify-content: center;
    gap: 8px;
`;

const PageBtn = styled.button`
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: 1px solid ${({ theme, $active }) => $active ? theme.main.regular : theme.gray.regular};
    background-color: ${({ theme, $active }) => $active ? theme.main.regular : 'white'};
    color: ${({ theme, $active }) => $active ? 'white' : theme.text};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;

    &:hover:not(:disabled) {
        border-color: ${({ theme }) => theme.main.regular};
        color: ${({ theme }) => theme.main.regular};
        background-color: transparent;
    }

    &:disabled {
        opacity: 0.5;
        cursor: default;
    }
`;