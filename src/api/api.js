import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// axios 인스턴스 생성
const apiClient = axios.create({
	baseURL: API_URL,
});

// 아이디 중복 확인 로직
const checkUsername = (username) => {
	return apiClient.get(`/auth/check-username`, {
		params: { username }
	});
};

// 회원가입 요청
const signup = (userData) => {
	return apiClient.post(`/auth/signup`, userData);
};

const apiLogin = async (email, password) => {
    const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        // 백엔드에서 보낸 에러 메시지를 사용
        throw new Error(data.error || '로그인에 실패했습니다.');
    }
    
    return data; // { message, session, user }
};

export { checkUsername, signup, apiLogin };