import React, { useState } from 'react';
import S from './NavBar.styles';
import LogoButton from './LogoButton';
import { GridColumn, GridContainer } from '../../common/grid/Grid';
import UserMenu from './UserMenu';

const NavBar = () => {

    // Todo : 추후에 전역 상태로 관린
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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
                    <UserMenu isLoggedIn={isLoggedIn} />
                </GridColumn>
            </GridContainer>
        </S.NavContainer>
    );
};

export default NavBar;