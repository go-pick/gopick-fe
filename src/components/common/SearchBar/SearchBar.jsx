import React, { useState } from 'react';
import { SearchContainer, SearchInput, SearchButton } from './SearchBar.styles';
import { Search } from 'react-bootstrap-icons'; // Bootstrap 아이콘 import

const SearchBar = ({ onSearch }) => {
	const [searchTerm, setSearchTerm] = useState('');

	const handleInputChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const handleSearchClick = () => {
		if (onSearch) {
			onSearch(searchTerm);
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			handleSearchClick();
		}
	};

	return (
		<SearchContainer>
			<SearchInput
				type="text"
				placeholder="검색..."
				value={searchTerm}
				onChange={handleInputChange}
				onKeyPress={handleKeyPress}
			/>
			<SearchButton onClick={handleSearchClick}>
				{/* Bootstrap 아이콘 컴포넌트 사용 
					size props로 크기를 조절할 수 있습니다.
				*/}
				<Search size={20} />
			</SearchButton>
		</SearchContainer>
	);
};

export default SearchBar;