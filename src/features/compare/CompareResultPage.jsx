import React, { useEffect } from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ChevronLeft } from 'react-bootstrap-icons';
import { getSpecIcon } from '../../utils/specIcons'; // utils 경로 확인 필요

const CompareResultPage = () => {
	const location = useLocation();
	const navigate = useNavigate();
	
	// 1. 이전 페이지(ComparePage)에서 보낸 데이터 받기
	const { rankedData, specDefinitions, weights } = location.state || {};

	// 2. 데이터 없이 직접 URL로 접근했을 때 튕겨내기 (보안)
	if (!rankedData || !specDefinitions) {
		return <Navigate to="/compare" replace={true} />;
	}

	const prioritySpecs = specDefinitions.filter(spec => 
        spec.eng_name !== 'price' && weights && weights[spec.eng_name] > 0
    );
	const otherSpecs = specDefinitions.filter(spec => 
        spec.eng_name !== 'price' && (!weights || !weights[spec.eng_name])
    );

	// 4. 값 표시 헬퍼 함수
	// 가격 콤마, 해상도 객체 처리 등을 담당
	const renderSpecValue = (key, value) => {
		if (value === undefined || value === null || value === '') return '-';
		
		// 가격: 3자리마다 콤마
		if (key === 'price') return Number(value).toLocaleString();
		
		// 해상도: 객체({width, height}) -> 문자열 변환
		if (key === 'screen_resolution' && typeof value === 'object') {
			return `${value.width} x ${value.height}`;
		}
		
		// 일반 값
		return value;
	};

	const RenderSpecGrid = ({ specs }) => (
        <>
            {specs.map(spec => (
                <React.Fragment key={spec.eng_name}>
                    <ProductGrid $count={rankedData.length} style={{marginTop: '30px'}}>
                        {rankedData.map(p => {
							const value = p.specs[spec.eng_name]
                            return (
                                <SpecCell key={p.unique_id}>
                                    <IconWrapper>
                                        {getSpecIcon(spec.icon_key || spec.eng_name)}
                                    </IconWrapper>
                                    <SpecValue>
                                        {renderSpecValue(spec.eng_name, value)}
                                        <Unit>{spec.unit}</Unit>
                                    </SpecValue>
                                    {/* 스펙 이름 추가 (선택 사항) */}
                                    <SpecLabel>{spec.kor_name}</SpecLabel>
                                </SpecCell>
                            );
                        })}
                    </ProductGrid>
                </React.Fragment>
            ))}
        </>
    );

	return (
		<Container>
			{/* 상단: 뒤로가기 헤더 */}
			<Header>
				<BackButton onClick={() => navigate('/compare')}>
					<ChevronLeft /> 다시 설정하기
				</BackButton>
			</Header>
			<ContentBox>
				{/* [섹션 1] 상품 정보 & 종합 점수 */}
				{/* ProductGrid는 상품 개수($count)만큼 n등분하여 컬럼을 만듭니다 */}
				<ProductGrid $count={rankedData.length}>
					{rankedData.map((product) => (
						<ProductColumn key={product.unique_id}>
							<ImageWrapper>
								{product.image_url ? (
									<img src={product.image_url} alt={product.name} />
								) : (
									<NoImage>No Image</NoImage>
								)}
							</ImageWrapper>
							
							<ProductName>
								{product.name}
								<OptionBadge>
									{product.variant_name}
								</OptionBadge>
							</ProductName>
							<TotalScore>
								{product.score}
							</TotalScore>
						</ProductColumn>
					))}
				</ProductGrid>

				<Divider />

                {/* [섹션 2] 상세 스펙 리스트 (통합 루프) */}
				<SpecContainer>
					<ProductGrid $count={rankedData.length}>
						{rankedData.map(p => (
							<SpecCell key={p.unique_id}>
								{getSpecIcon('price')}
								<SpecValue>
									{p.price ? Number(p.price).toLocaleString() : '-'}
								</SpecValue>
								<SpecLabel>가격</SpecLabel>
							</SpecCell>
						))}
					</ProductGrid>

					{prioritySpecs.length > 0 && (
                        <>
                            {/* <SectionDivider />  */}
                            {/* <SectionTitle $highlight>⭐ 핵심 비교 항목</SectionTitle> */}
                            <RenderSpecGrid specs={prioritySpecs} />
                        </>
                    )}
					<Divider />
					{otherSpecs.length > 0 && (
                        <>
                            {/* <SectionDivider />
                            <SectionTitle>기타 스펙</SectionTitle> */}
                            <RenderSpecGrid specs={otherSpecs} />
                        </>
                    )}
				</SpecContainer>

			</ContentBox>
		</Container>
    );
};

export default CompareResultPage;

/* -------------------------------------------------------------------------- */
/* Styled Components                                                          */
/* -------------------------------------------------------------------------- */

const Container = styled.div`
    max-width: 1000px; /* 시안과 비슷한 적당한 폭 */
    margin: 0 auto;
    padding: 40px 20px 80px 20px;
    min-height: 100vh;
`;

const Header = styled.div`
    margin-bottom: 20px;
`;

const BackButton = styled.button`
    background: none;
    border: none;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #868e96;
    cursor: pointer;
    &:hover { color: #333; }
`;

const ContentBox = styled.div`
    background: transparent;
    border-radius: 30px;
    border: 1px solid ${({ theme }) => theme.gray.regular};
    padding: 60px 40px; /* 내부 여백 넉넉하게 */

	transition: background 0.3s ease-in-out;
`;

/* [핵심 레이아웃] 상품 개수에 따라 1/n 등분 */
const ProductGrid = styled.div`
    display: grid;
    /* 상품이 3개면 1fr 1fr 1fr */
    grid-template-columns: repeat(${props => props.$count}, 1fr);
    gap: 20px;
    width: 100%;
    text-align: center;
	/* border-bottom: 1px solid ${({ theme }) => theme.gray.regular}; */
`;

const ProductColumn = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ImageWrapper = styled.div`
    width: 180px;
    height: 180px;
    margin-bottom: 24px;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
`;

const NoImage = styled.div`
    color: #adb5bd;
    font-size: 14px;
`;

const ProductName = styled.div`
    font-size: 1.1rem;
    font-weight: 500;
    color: ${({ theme }) => theme.text};
    margin-bottom: 8px;
    line-height: 1.4;
    padding: 0 10px;
    word-break: keep-all;
`;

const OptionBadge = styled.span`
    display: block;
    font-size: 0.85rem;
    color: ${({ theme }) => theme.textSub};
    margin-top: 4px;
    font-weight: 400;
`;

const TotalScore = styled.div`
    font-size: 3rem; 
    font-weight: 800;
    color: ${({ theme }) => theme.text};
    margin-top: 10px;
`;

const Divider = styled.hr`
    border: none;
    border-top: 1px solid ${({ theme }) => theme.gray.regular};
    margin: 2rem -40px 1rem; /* 위아래 간격 */
`;

const SpecContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.3rem;
`;

const SpecCell = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
`;

const SpecLabel = styled.div`
    font-size: 12px;
    color: ${({ theme }) => theme.main.regular};
    margin-top: -4px;
`;

const IconWrapper = styled.div`
    font-size: 28px; /* 아이콘 크기 */
    color: ${({ theme }) => theme.icon};
    
    /* 아이콘 수직 정렬 보정 */
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
`;

const SpecValue = styled.div`
    font-size: 1rem;
    color: ${({ theme }) => theme.text};
    font-weight: 500;
`;

const Unit = styled.span`
    font-size: 0.8rem;
    color: ${({ theme }) => theme.text};
    margin-left: 2px;
    font-weight: 400;
`;