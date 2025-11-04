import React from 'react';
import S from './NavBar.styles';
import LogoButton from './LogoButton';
import { GridColumn, GridContainer } from '../common/Grid';

const NavBar = () => {
    return (
        <S.NavContainer>
            <GridContainer>
                <GridColumn col={2}>
                    <LogoButton />
                </GridColumn>
                <GridColumn col={2}>
                    <S.MenuWrapper>
                        <S.MenuItem to={"/howtouse"}>
                            사용법
                        </S.MenuItem>
                        <S.MenuItem to={"/compare"}>
                            비교하기
                        </S.MenuItem>
                    </S.MenuWrapper>
                </GridColumn>
                <GridColumn col={3}>
                    
                </GridColumn>
            </GridContainer>
        </S.NavContainer>
    );
};

export default NavBar;