// src/components/common/Spinner/Spinner.styles.js
import styled, { keyframes } from 'styled-components';

// 1. 회전 애니메이션 정의
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// 2. 스피너 스타일
export const StyledSpinner = styled.div`
  display: inline-block;
  
  /* [크기] prop으로 받거나 여기서 고정 (예: 2rem) */
  width: ${({ size }) => size || '2rem'};
  height: ${({ size }) => size || '2rem'};

  /* [모양] */
  border: 4px solid ${({ theme }) => theme.textSub}; /* 연한 회색 트랙 */
  border-top-color: ${({ theme }) => theme.main.regular}; /* 메인 컬러 스피너 */
  border-radius: 50%;

  /* [애니메이션] */
  animation: ${spin} 1s linear infinite;
`;