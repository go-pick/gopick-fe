import React, { useState, useEffect, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { useParams } from 'react-router-dom';
import { GridContainer, GridItem } from '../../components/common/grid/Grid';
import { getSpecIcon } from '../../utils/specIcons';
import { getProductDetail } from '../../api/api';

const ProductDetailPage = () => {
    const { id } = useParams();
    
    const [product, setProduct] = useState(null);
    const [variants, setVariants] = useState([]); 
    const [selectedVariant, setSelectedVariant] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dynamicSpecDefinitions, setDynamicSpecDefinitions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // 백엔드에서 variants와 category.specs를 모두 포함해서 준다고 가정
                const data = await getProductDetail(id);

                if (!data) throw new Error("데이터가 없습니다.");

                setProduct(data);
                
                // 카테고리 스펙 정의 가져오기
                const catSpecs = data.category?.specs || [];
                const priceSpec = { eng_name: 'price', kor_name: '가격', unit: '원', icon_key: 'price' };
                // 가격 중복 방지 후 합치기
                const finalSpecs = [priceSpec, ...catSpecs.filter(s => s.eng_name !== 'price')];
                
                setDynamicSpecDefinitions(finalSpecs);

                // Variants 설정
                const variantList = data.variants || [];
                setVariants(variantList);

                if (variantList.length > 0) {
                    setSelectedVariant(variantList[0]);
                }

            } catch (err) {
                console.error(err);
                setError("오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    const currentSpecs = useMemo(() => {
        if (!product || !selectedVariant) return {};
        return {
            ...(product.common_specs || {}),        
            ...(selectedVariant.option_specs || {}), 
            price: selectedVariant.price            
        };
    }, [product, selectedVariant]);

    const renderValue = (key, val) => {
        if (val === undefined || val === null || val === '') return '-';
        if (key === 'price') return Number(val).toLocaleString();
        if (key === 'screen_resolution' && typeof val === 'object') {
            const w = val.width || '?';
            const h = val.height || '?';
            return `${w} x ${h}`;
        }
        return val;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return dateString.length >= 7 ? dateString.slice(0, 7) : dateString;
    };

    if (loading) return <PageWrapper><Message>Loading...</Message></PageWrapper>;
    if (error) return <PageWrapper><Message>{error}</Message></PageWrapper>;
    if (!product) return <PageWrapper><Message>제품 없음</Message></PageWrapper>;

    return (
        <PageWrapper>
            <GridContainer gap="2rem">
                <GridItem colStart={2} colSpan={5} align="flex-start">
                    <StickyWrapper>
                        <LeftCard>
                            <ImageArea>
                                {product.image_url ? (
                                    <img src={product.image_url} alt={product.name} />
                                ) : (
                                    <Placeholder />
                                )}
                            </ImageArea>
                            <ProductInfo>
                                <ProductName>{product.name}</ProductName>
                                
                                {variants.length > 0 && (
                                    <VariantSection>
                                        <VariantTitle>옵션 선택</VariantTitle>
                                        <VariantList>
                                            {variants.map((v) => (
                                                <VariantChip 
                                                    key={v.id} 
                                                    $isActive={selectedVariant?.id === v.id}
                                                    onClick={() => setSelectedVariant(v)}
                                                >
                                                    {v.variant_name}
                                                </VariantChip>
                                            ))}
                                        </VariantList>
                                    </VariantSection>
                                )}

                                <MetaList>
                                    <MetaItem>출시 : {formatDate(product.released_date)}</MetaItem>
                                    <MetaItem>제조 : {product.maker?.name || '-'}</MetaItem>
                                </MetaList>
                            </ProductInfo>
                        </LeftCard>
                    </StickyWrapper>
                </GridItem>

                <GridItem colStart={7} colSpan={5} align="flex-start">
                    <RightCard>
                        <SectionTitle>
                             상세 스펙
                             <SubTitle>({selectedVariant?.variant_name || '기본'})</SubTitle>
                        </SectionTitle>
                        <Divider />
                        
                        <SpecListArea>
                            <SpecGrid>
                                {dynamicSpecDefinitions.map((spec) => (
                                    <SpecItem key={spec.eng_name}>
                                        {/* 1. 아이콘 (CompareResultPage 스타일 적용) */}
                                        <IconWrapper>
                                            {getSpecIcon(spec.icon_key)}
                                        </IconWrapper>
                                        
                                        {/* 2. 값 + 단위 */}
                                        <SpecValue>
                                            {renderValue(spec.eng_name, currentSpecs[spec.eng_name])}
                                            <Unit>{spec.unit}</Unit>
                                        </SpecValue>

                                        {/* 3. 라벨 (메인 컬러 적용) */}
                                        <SpecLabel>{spec.kor_name}</SpecLabel>
                                    </SpecItem>
                                ))}
                            </SpecGrid>
                        </SpecListArea>
                    </RightCard>
                </GridItem>
            </GridContainer>
        </PageWrapper>
    );
};

export default ProductDetailPage;

/* -------------------------------------------------------------------------- */
/* Styled Components                                                          */
/* -------------------------------------------------------------------------- */

const PageWrapper = styled.div`
    width: 100%;
    min-height: 100vh;
    padding-top: 60px;
    padding-bottom: 80px;
    background-color: ${({ theme }) => theme.background};

	transition: background-color 0.3 ease-out;
`;

const Message = styled.div`
    width: 100%; height: 300px;
    display: flex; justify-content: center; align-items: center; color: ${({ theme }) => theme.textSub};
`;

/* Sticky Wrapper */
const StickyWrapper = styled.div`
    position: sticky;
    top: 100px;
    height: fit-content;
`;

/* Left Card Style */
const LeftCard = styled.div`
    border: 1px solid ${({ theme }) => theme.gray?.regular};
    border-radius: 20px;
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: transparent;
    width: 100%; 
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
`;

const ImageArea = styled.div`
    width: 250px; 
    height: 250px;
    margin-bottom: 30px;
    display: flex; justify-content: center; align-items: center;
    img { width: 100%; height: 100%; object-fit: contain; }
`;

const Placeholder = styled.div`
    width: 100%; height: 100%; background-color: transparent;
`;

const ProductInfo = styled.div`
    text-align: center; width: 100%; margin-bottom: 10px; 
`;

const ProductName = styled.h1`
    font-size: 1.6rem; font-weight: 700; margin-bottom: 20px;
    color: ${({ theme }) => theme.text || '#333'};
`;

const VariantSection = styled.div`
    margin-bottom: 24px; width: 100%;
`;

const VariantTitle = styled.div`
    font-size: 0.85rem; color: #888; margin-bottom: 8px; text-align: center;
`;

const VariantList = styled.div`
    display: flex; flex-wrap: wrap; justify-content: center; gap: 8px;
`;

const VariantChip = styled.button`
    padding: 6px 14px; border-radius: 16px; font-size: 0.85rem; font-weight: 600; cursor: pointer; background-color: transparent;
    ${({ $isActive, theme }) => $isActive ? css`
        border: 2px solid ${theme.main.regular};
        color: ${theme.main.regular};
    ` : css`
        border: 1px solid ${theme.gray.regular};
        color: ${theme.textSub || '#888'};
        &:hover { border-color: ${theme.text || '#333'}; }
    `}
`;

const MetaList = styled.div`
    display: flex; flex-direction: column; gap: 6px; margin-top: 20px;
`;

const MetaItem = styled.div`
    font-size: 0.9rem; color: ${({ theme }) => theme.textSub || '#888'};
`;

/* Right Card Style */
const RightCard = styled.div`
    border: 1px solid ${({ theme }) => theme.gray?.regular || '#ddd'};
    border-radius: 20px;
    padding: 30px 0;
    background: transparent;
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 550px; 
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
`;

const SectionTitle = styled.h2`
    font-size: 1.2rem; font-weight: 700; text-align: center; margin-bottom: 15px;
    color: ${({ theme }) => theme.text || '#333'};
    display: flex; flex-direction: column; gap: 4px;
`;

const SubTitle = styled.span`
    font-size: 0.8rem; font-weight: 400; color: ${({ theme }) => theme.textSub};
`;

const Divider = styled.div`
    width: 100%; height: 1px; background-color: ${({ theme }) => theme.gray.regular}; margin-bottom: 0;
`;

const SpecListArea = styled.div`
    padding: 20px 30px;
`;

const SpecGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr); 
    column-gap: 20px;
    row-gap: 40px; /* 아이템 간 간격을 넉넉하게 */
    width: 100%;
`;

const SpecItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
`;

const IconWrapper = styled.div`
    font-size: 28px;
    color: ${({ theme }) => theme.icon};
    
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    margin-bottom: 2px;
`;

const SpecValue = styled.div`
    font-size: 1rem;
    color: ${({ theme }) => theme.text};
    font-weight: 500;
`;

const Unit = styled.span`
    font-size: 0.8rem;
    color: ${({ theme }) => theme.text || '#333'};
    margin-left: 2px;
    font-weight: 400;
`;

const SpecLabel = styled.div`
    font-size: 12px;
    color: ${({ theme }) => theme.main.regular};
    margin-top: -2px;
`;