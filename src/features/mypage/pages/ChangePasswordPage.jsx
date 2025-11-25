import React, { useEffect, useState } from 'react';
import S from '../MyPage.styles';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { confirmPasswordReset, requestPasswordResetEmail } from '../../../api/api';
import { supabase } from '../../../supabaseClient';
import { Button, TextBox } from '../../../components/common';

const ChangePasswordPage = () => {
	const [isSent, setIsSent] = useState(false);

    const handleSendVerification = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return alert("로그인 정보가 없습니다.");

            // [핵심] 리다이렉트 주소를 '새로 만든 페이지'로 지정합니다.
            const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
                redirectTo: 'http://localhost:3000/mypage/update-password', 
            });

            if (error) throw error;
            setIsSent(true);
        } catch (error) {
            console.error(error);
            alert('메일 발송 실패: ' + error.message);
        }
    };
	
	return (
		<S.ContentWrapper>
			<S.SubTitle>비밀번호 변경</S.SubTitle>
			{ !isSent ? (
				<S.SubContentContainer>
					<S.SubDescription>
						회원님의 소중한 정보를 위해 이메일 인증을 진행합니다.<br />
						아래 버튼을 누르면 인증 메일이 발송됩니다.
					</S.SubDescription>
					<Button onClick={handleSendVerification} width={"200px"}>
						인증메일 보내기
					</Button>
				</S.SubContentContainer>
			) : (
				<S.SubContentContainer>
					<S.SubDescription>
						메일함을 확인해주세요. <br/>
						메일 내의 링크를 클릭하면 비밀번호 변경화면으로 자동 전환됩니다.
					</S.SubDescription>
					<Button onClick={handleSendVerification} width={"200px"}>
						메일 재발송
					</Button>
				</S.SubContentContainer>
			)}
		</S.ContentWrapper>
	);
};

export default ChangePasswordPage;