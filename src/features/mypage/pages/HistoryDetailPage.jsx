import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ChevronLeft, ChevronDown, ChevronUp, Star, StarFill } from 'react-bootstrap-icons';
import S from '../MyPage.styles'; 
import { getSpecIcon } from '../../../utils/specIcons'; // [수정] 경로 수정됨
import { getHistoryDetail } from '../../../api/api';
import { useAuth } from '../../../contexts/AuthContext';

const HistoryDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { session } = useAuth();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDetailOpen, setIsDetailOpen] = useState(false); // [New] 상세 스펙 토글 상태

    useEffect(() => {
        if (!session?.access_token) return;

        const fetchData = async () => {
            try {
                const res = await getHistoryDetail(id, session.access_token);
                setData(res); 
            } catch (err) {
                console.error(err);
                alert("기록을 불러오는데 실패했습니다.");
                navigate('/mypage/history');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, session, navigate]);

    if (loading) return <LoadingMsg>불러오는 중...</LoadingMsg>;
    if (!data) return null;

    const { rankedData, specDefinitions, weights } = data;

    // --- Helper Functions ---

    const renderSpecValue = (key, value) => {
        if (value === undefined || value === null || value === '') return '-';
        if (key === 'price') return Number(value).toLocaleString();
        if (key === 'screen_resolution' && typeof value === 'object') {
            return `${value.width} x ${value.height}`;
        }
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

    // 가중치가 설정된 항목만 필터링
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
                
                {/* [1구역] 제품 헤더 (이미지, 이름, 점수) */}
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
                            {/* [수정] 1등 강조 제거, 통일된 스타일 */}
                            <ScoreBox>
                                <ScoreLabel>적합도</ScoreLabel>
                                <ScoreValue>{product.score}점</ScoreValue>
                            </ScoreBox>
                        </ProductColumn>
                    ))}
                </ProductGrid>

                <Divider />

                {/* [2구역] 가중치 모음 (설정값 요약) */}
                <SectionTitle>내가 설정한 중요도</SectionTitle>
                <PreferenceGrid>
                    {weightedSpecs.length > 0 ? (
                        weightedSpecs.map(spec => (
                            <PreferenceCard key={spec.eng_name}>
                                <div className="info">
                                    <IconBox>{getSpecIcon(spec.icon_key || spec.eng_name)}</IconBox>
                                    <span className="name">{spec.kor_name}</span>
                                </div>
                                {renderStars(weights[spec.eng_name])}
                            </PreferenceCard>
                        ))
                    ) : (
                        <EmptyPref>설정한 가중치가 없습니다.</EmptyPref>
                    )}
                </PreferenceGrid>

                <Divider />

                {/* [3구역] 상세 스펙 보기 (드롭다운/토글) */}
                <ToggleButton onClick={() => setIsDetailOpen(!isDetailOpen)} $isOpen={isDetailOpen}>
                    <span>상세 스펙 비교 {isDetailOpen ? '접기' : '보기'}</span>
                    {isDetailOpen ? <ChevronUp /> : <ChevronDown />}
                </ToggleButton>

                <DetailContainer $isOpen={isDetailOpen}>
                    <DetailContent>
                        {/* 가격 (항상 맨 위) */}
                        <DetailRowTitle>기본 정보</DetailRowTitle>
                        <ProductGrid $count={rankedData.length} style={{marginBottom: '30px'}}>
                            {rankedData.map(p => (
                                <SpecCell key={p.unique_id}>
                                    <div style={{fontWeight: 800, fontSize: '14px'}}>KRW</div>
                                    <SpecValue>{renderSpecValue('price', p.price)}</SpecValue>
                                </SpecCell>
                            ))}
                        </ProductGrid>

                        {/* 나머지 모든 스펙 Loop */}
                        {specDefinitions.map(spec => {
                            if (spec.eng_name === 'price') return null; // 가격 제외
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

/* --- Local Styles --- */

const Header = styled.div`
    display: flex; align-items: center; padding: 20px 30px;
    border-bottom: 1px solid ${({ theme }) => theme.gray.regular};
`;
const BackButton = styled.button`
    background: none; border: none; display: flex; align-items: center; gap: 6px;
    font-size: 14px; color: #868e96; cursor: pointer; &:hover { color: #333; }
`;
const HeaderTitle = styled.div` flex: 1; text-align: center; font-weight: 700; font-size: 1.1rem; padding-right: 60px; `;
const ContentBody = styled.div` padding: 40px 30px; `;

/* [1] 제품 헤더 스타일 */
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
const ProductName = styled.div` font-size: 1rem; font-weight: 600; color: #333; margin-bottom: 8px; line-height: 1.3; padding: 0 5px; `;
const OptionBadge = styled.span` display: block; font-size: 0.8rem; color: #868e96; font-weight: 400; margin-top: 2px; `;

const ScoreBox = styled.div`
    background-color: transparent;
    padding: 8px 16px;
    border-radius: 8px;
    margin-top: 8px;
`;
const ScoreLabel = styled.div` font-size: 0.75rem; color: ${({ theme }) => theme.textSub}; margin-bottom: 2px; `;
const ScoreValue = styled.div` font-size: 1.2rem; font-weight: 800; color: ${({ theme }) => theme.text}; `;

/* [2] 가중치 모음 스타일 */
const PreferenceGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 12px;
`;
const PreferenceCard = styled.div`
    border: 1px solid ${({ theme }) => theme.gray.regular};
    border-radius: 12px;
    padding: 12px 16px;
    display: flex; justify-content: space-between; align-items: center;
    
    .info { display: flex; align-items: center; gap: 8px; }
    .name { font-size: 0.9rem; font-weight: 600; color: #495057; }
`;
const IconBox = styled.div` font-size: 16px; color: ${({ theme }) => theme.icon}; display: flex; `;
const StarWrapper = styled.div` display: flex; gap: 2px; `;
const EmptyPref = styled.div` color: #adb5bd; font-size: 0.9rem; padding: 10px; `;

/* [3] 상세 스펙 토글 스타일 */
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
    background-color: #fff;
    border: 1px solid ${({ theme }) => theme.gray.regular};
    border-top: none;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
`;

const DetailContent = styled.div` padding: 30px 0; `;
const DetailRowTitle = styled.div` text-align: center; font-size: 0.85rem; color: #adb5bd; margin-bottom: 20px; font-weight: 700; `;

/* 스펙 셀 스타일 (공통) */
const SpecCell = styled.div` display: flex; flex-direction: column; align-items: center; gap: 6px; `;
const IconWrapper = styled.div` font-size: 24px; color: #333; display: flex; height: 30px; align-items: center; `;
const SpecValue = styled.div` font-size: 0.95rem; color: #333; font-weight: 500; `;
const Unit = styled.span` font-size: 0.75rem; color: #868e96; margin-left: 3px; font-weight: 400; background: #f1f3f5; padding: 2px 4px; border-radius: 4px;`;
const SpecLabel = styled.div` font-size: 0.75rem; color: #adb5bd; `;

const Divider = styled.div` height: 1px; background-color: #eee; margin: 30px 0; `;
const SectionTitle = styled.div` font-size: 0.95rem; font-weight: 700; color: #868e96; margin-bottom: 16px; `;
const LoadingMsg = styled.div` text-align: center; padding: 100px 0; color: #adb5bd; `;