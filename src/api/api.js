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

export { checkUsername, signup };