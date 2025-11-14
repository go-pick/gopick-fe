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
    try {
        const response = await apiClient.post('/auth/login', {
            email: email,
            password: password
        });
        return response.data; // { message, session, user }

    } catch (error) {
        throw new Error(error.response?.data?.error || '로그인에 실패했습니다.');
    }
};

const getUsername = async (token) => {
    if (!token) {
        throw new Error('Access token is missing.');
    }

    try {
        const response = await apiClient.get('/auth/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    
        return response.data;
    } catch(error) {
        console.error("Failed fetch Profile: ", error.response?.data?.error || error.message);
        throw new Error(error.response?.data?.error || '프로필 정보를 가져오는데 실패했습니다.');
    }
};

export { checkUsername, signup, apiLogin, getUsername };