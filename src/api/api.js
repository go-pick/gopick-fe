import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// axios 인스턴스 생성
const apiClient = axios.create({
	baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
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

const requestPasswordResetEmail = async (email) => {
    const response = await apiClient.post('/auth/password-reset/request', {
        email: email
    });
    return response.data;
};

const confirmPasswordReset = async (token, newPassword) => {
    const response = await apiClient.post('/auth/password-reset/confirm', {
        password: newPassword
    },{
        headers: {
            Authorization: `Bearer ${token}` // 수동으로 토큰 주입
        }
    });
    return response.data;
};

export { 
    checkUsername, 
    signup, 
    apiLogin, 
    getUsername, 
    requestPasswordResetEmail,
    confirmPasswordReset,
};