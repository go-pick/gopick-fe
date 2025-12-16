import React, { useState } from 'react';
import S from './NavBar.styles';
import LogoButton from './LogoButton';
import { GridContainer, GridItem } from '../../common/grid/Grid';
import UserMenu from './UserMenu';
import SearchBar from '../../common/SearchBar';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
	const navigate = useNavigate();

	const handleSearch = (term) => {
		if (!term || term.trim() === '') return;
		navigate(`/search?q=${encodeURIComponent(term)}`)
	}

    return (
        <S.NavContainer>
            <GridContainer>
                <GridItem colStart={1} colSpan={2}>
                    <LogoButton />
                </GridItem>
                <GridItem colStart={3} colSpan={2}>
                    <S.MenuWrapper>
                        <S.MenuItem to={"/howtouse"}>
                            사용법
                        </S.MenuItem>
                        <S.MenuItem to={"/compare"}>
                            비교하기
                        </S.MenuItem>
                    </S.MenuWrapper>
                </GridItem>
                <GridItem colStart={7} colSpan={3}>
                    <SearchBar onSearch={handleSearch}/>
                </GridItem>
                <GridItem colStart={11} colSpan={2}>
                    <UserMenu />
                </GridItem>
            </GridContainer>
        </S.NavContainer>
    );
};

export default NavBar;