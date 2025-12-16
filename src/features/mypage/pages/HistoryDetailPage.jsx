import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ChevronLeft, ChevronDown, ChevronUp, Star, StarFill } from 'react-bootstrap-icons';
import S from '../MyPage.styles'; 
import { getSpecIcon } from '../../../utils/specIcons';
import { getHistoryDetail } from '../../../api/api';
import { useAuth } from '../../../contexts/AuthContext';

const HistoryDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { session } = useAuth();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDetailOpen, setIsDetailOpen] = useState(false); // 드롭다운 토글 상태

    useEffect(() => {
        if (!session?.access_token) return;

        const fetchData = async () => {
            try {
                const res = await getHistoryDetail(id, session.access_token);
                setData(res); 
            } catch (err) {
                console.error(err);
                alert("데이터를 불러오지 못했습니다.");
                navigate('/mypage/history');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, session, navigate]);

    if (loading) return <div>Loading...</div>;
    if (!data) return null;

    const { rankedData, specDefinitions, weights } = data;

    // --- 렌더링 헬퍼 함수 ---

    const renderSpecValue = (key, value) => {
        if (value === undefined || value === null || value === '') return '-';
        
        // 가격 처리
        if (key === 'price') return Number(value).toLocaleString();
        
        // 해상도 같은 객체 데이터 처리
        if (typeof value === 'object') {
            return `${value.width} x ${value.height}`;
        }
        
        // boolean 처리
        if (typeof value === 'boolean') return value ? 'O' : 'X';

        return value;
    };

    const renderStars = (score) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                i <= score ? 
                <StarFill key={i} size={12} color="#4dabf7" /> : 
                <Star key={i} size={12} color="#dee2e6" />
            );
        }
        return <StarWrapper>{stars}</StarWrapper>;
    };

    // 가중치 0보다 큰 것만 필터링 (가격 제외)
    const weightedSpecs = specDefinitions.filter(spec => 
        spec.eng_name !== 'price' && weights && weights[spec.eng_name] > 0
    );

    return (
        <S.ContentWrapper>
            <Header>
                <BackButton onClick={() => navigate('/mypage/history')}>
                    <ChevronLeft /> 목록으로
                </BackButton>
                <HeaderTitle>상세 비교 결과</HeaderTitle>
            </Header>

            <ContentBody>
                
                {/* 1. 제품 기본 정보 및 점수 */}
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
                                <OptionBadge>{product.variant_name}</OptionBadge>
                            </ProductName>
                            <ScoreBox>
                                <ScoreValue>{product.score}점</ScoreValue>
                            </ScoreBox>
                        </ProductColumn>
                    ))}
                </ProductGrid>

                <Divider />

                {/* 2. 가중치 설정 내역 */}
                <SectionTitle>설정한 중요도</SectionTitle>
                <PreferenceGrid>
                    {weightedSpecs.map(spec => (
                        <PreferenceCard key={spec.eng_name}>
                            <div className="info">
                                <IconBox>{getSpecIcon(spec.icon_key || spec.eng_name)}</IconBox>
                                <span className="name">{spec.kor_name}</span>
                            </div>
                            {renderStars(weights[spec.eng_name])}
                        </PreferenceCard>
                    ))}
                </PreferenceGrid>
                
                <div style={{height: "1rem"}}></div>

                {/* 3. 상세 스펙 비교 (드롭다운) */}
                <ToggleButton onClick={() => setIsDetailOpen(!isDetailOpen)} $isOpen={isDetailOpen}>
                    <span>상세 스펙 비교 {isDetailOpen ? '접기' : '보기'}</span>
                    {isDetailOpen ? <ChevronUp /> : <ChevronDown />}
                </ToggleButton>

                <DetailContainer $isOpen={isDetailOpen}>
                    <DetailContent>
                        {/* 가격 정보 (맨 위 고정) */}
                        <ProductGrid $count={rankedData.length} style={{marginBottom: '30px'}}>
                            {rankedData.map(p => (
                                <SpecCell key={p.unique_id}>
                                    <IconWrapper>
                                        {getSpecIcon('price')}
                                    </IconWrapper>
                                    <SpecValue>{renderSpecValue('price', p.price)} 원</SpecValue>
                                    <SpecLabel>가격</SpecLabel>
                                </SpecCell>
                            ))}
                        </ProductGrid>

                        {/* 나머지 스펙 루프 */}
                        {specDefinitions.map(spec => {
                            if (spec.eng_name === 'price') return null; // 가격 제외하고 루프
                            return (
                                <React.Fragment key={spec.eng_name}>
                                    <ProductGrid $count={rankedData.length} style={{ marginBottom: '24px' }}>
                                        {rankedData.map(p => (
                                            <SpecCell key={p.unique_id}>
                                                <IconWrapper>
                                                    {getSpecIcon(spec.icon_key || spec.eng_name)}
                                                </IconWrapper>
                                                <SpecValue>
                                                    {renderSpecValue(spec.eng_name, p.specs[spec.eng_name])}
                                                    <Unit>{spec.unit}</Unit>
                                                </SpecValue>
                                                <SpecLabel>{spec.kor_name}</SpecLabel>
                                            </SpecCell>
                                        ))}
                                    </ProductGrid>
                                </React.Fragment>
                            );
                        })}
                    </DetailContent>
                </DetailContainer>

            </ContentBody>
        </S.ContentWrapper>
    );
};

export default HistoryDetailPage;

/* --- Local Styles (기존 디자인 유지) --- */

const Header = styled.div`
    display: flex; align-items: center; padding: 20px 30px;
    border-bottom: 1px solid ${({ theme }) => theme.gray.regular};
`;
const BackButton = styled.button`
    background: none; border: none; display: flex; align-items: center; gap: 6px;
    font-size: 14px;
	color: ${({ theme }) => theme.gray.regular};
	cursor: pointer;
	text-decoration: none;
	&:hover {
		color: ${({ theme }) => theme.gray.darken};
		text-decoration: underline;
	}
`;


const HeaderTitle = styled.div` flex: 1; text-align: center; font-weight: 700; font-size: 1.1rem; padding-right: 60px; `;
const ContentBody = styled.div` padding: 40px 30px; `;

const ProductGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(${props => props.$count}, 1fr);
    gap: 20px; width: 100%; text-align: center;
`;
const ProductColumn = styled.div` display: flex; flex-direction: column; align-items: center; `;
const ImageWrapper = styled.div`
    width: 120px; height: 120px; margin-bottom: 16px; border-radius: 16px;
    overflow: hidden; display: flex; justify-content: center; align-items: center;
    img { width: 100%; height: 100%; object-fit: contain; }
`;
const NoImage = styled.div` color: #ccc; font-size: 12px; `;

const ProductName = styled.div`
	font-size: 1rem; 
	font-weight: 600; 
	color: ${({ theme }) => theme.text};
	margin-bottom: 8px; 
	line-height: 1.3;
	padding: 0 5px;
`;

const OptionBadge = styled.span` display: block; font-size: 0.8rem; color: ${({ theme }) => theme.textSub}; font-weight: 400; margin-top: 2px; `;

const ScoreBox = styled.div`
    background-color: transparent; padding: 8px 16px; border-radius: 8px; margin-top: 8px;
`;
const ScoreValue = styled.div` font-size: 1.2rem; font-weight: 800; color: ${({ theme }) => theme.text}; `;

/* 가중치 스타일 */
const PreferenceGrid = styled.div`
    display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px;
`;
const PreferenceCard = styled.div`
    border: 1px solid ${({ theme }) => theme.gray.regular};
    border-radius: 12px; padding: 12px 16px;
    display: flex; justify-content: space-between; align-items: center;
    .info { display: flex; align-items: center; gap: 8px; }
    .name {
		font-size: 0.9rem;
		font-weight: 600;
		color: ${({ theme }) => theme.text};
	}
`;
const IconBox = styled.div` font-size: 16px; color: ${({ theme }) => theme.icon}; display: flex; `;
const StarWrapper = styled.div` display: flex; gap: 2px; `;

/* 토글 및 상세 컨테이너 */
const ToggleButton = styled.button`
    width: 100%;
    padding: 16px;
	background-color: transparent;
    border: 1px solid ${({ theme }) => theme.gray.regular};
    border-radius: 12px;
    color: ${({ theme }) => theme.text};
    font-weight: 600;
    cursor: pointer;
    display: flex; justify-content: center; align-items: center; gap: 8px;
    transition: all 0.2s;

    &:hover { background-color: ${({ theme }) => theme.backgroundSub}; }
`;

const DetailContainer = styled.div`
    overflow: hidden;
    max-height: ${props => props.$isOpen ? '2000px' : '0'}; /* 넉넉하게 */
    opacity: ${props => props.$isOpen ? '1' : '0'};
    transition: all 0.4s ease-in-out;
    background-color: transparent;
    border: 1px solid ${({ theme }) => theme.gray.regular};
    border-top: none;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
`;
const DetailContent = styled.div` padding: 30px 0; `;

/* 스펙 셀 스타일 */
const SpecCell = styled.div` display: flex; flex-direction: column; align-items: center; gap: 6px; `;
const IconWrapper = styled.div`
	font-size: 24px;
	color: ${({ theme }) => theme.icon};
	display: flex;
	height: 30px;
	align-items: center;
`;

const SpecValue = styled.div`
	font-size: 0.95rem;
	color: ${({ theme }) => theme.text};
	font-weight: 500;
`;

const Unit = styled.span`
	font-size: 0.75rem;
	color: ${({ theme }) => theme.text};
	margin-left: 2px; font-weight: 400;
`;

const SpecLabel = styled.div` font-size: 0.75rem; color: ${({ theme }) => theme.main.regular}; `;

const Divider = styled.hr`
    border: none; border-top: 1px solid ${({ theme }) => theme.gray.regular};
    margin: 2rem -40px 1rem;
`;
const SectionTitle = styled.div` font-size: 0.95rem; font-weight: 700; color: ${({ theme }) => theme.text}; margin-bottom: 16px; `;