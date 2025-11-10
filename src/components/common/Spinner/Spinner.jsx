// src/components/common/Spinner/Spinner.jsx
import React from 'react';
import { StyledSpinner } from './Spinner.styles';

/**
 * 로딩 스피너 컴포넌트
 * @param {string} [size] - 스피너 크기 (예: "3rem", "50px")
 */
const Spinner = ({ size }) => {
  return <StyledSpinner size={size} />;
};

export default Spinner;