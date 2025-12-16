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

/* -------------------------------------------------------------------------- */
/* Auth Related                                */
/* -------------------------------------------------------------------------- */

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
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

/* -------------------------------------------------------------------------- */
/* Product Related                               */
/* -------------------------------------------------------------------------- */

const getCategories = async () => {
    try {
        const response = await apiClient.get('/categories');
        return response.data; 
    } catch (error) {
        console.error("Failed fetch Categories: ", error.response?.data?.error || error.message);
        throw new Error(error.response?.data?.error || '카테고리 목록을 불러오는데 실패했습니다.');
    }
};

// [New] 제품 검색 API
const searchProducts = async (query, categorySlug) => {
    try {
        // GET /products/search?q=...&category=...
        const response = await apiClient.get('/products/search', {
            params: {
                q: query,
                category: categorySlug
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed search products: ", error.response?.data?.error || error.message);
        throw new Error('제품 검색에 실패했습니다.');
    }
};

const getProductDetail = async (productId) => {
    try {
        const response = await apiClient.get(`/products/${productId}`);
        return response.data; 
    } catch (error) {
        console.error("Failed fetch product detail: ", error.response?.data?.error || error.message);
        throw new Error('제품 상세 정보를 불러오는데 실패했습니다.');
    }
};

const getProductVariants = async (productId) => {
    try {
        // GET /products/:id/variants
        const response = await apiClient.get(`/products/${productId}/variants`);
        return response.data;
    } catch (error) {
        console.error("Failed fetch variants: ", error.response?.data?.error || error.message);
        throw new Error('제품 옵션 정보를 불러오는데 실패했습니다.');
    }
};

const calculateRanking = async (payload, token) => {
    try {
        const response = await apiClient.post('/products/calculate', payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed calculate ranking: ", error.response?.data?.error || error.message);
        throw new Error('랭킹 분석에 실패했습니다.');
    }
};

/* -------------------------------------------------------------------------- */
/* Hstory Related                               */
/* -------------------------------------------------------------------------- */

const getHistoryList = async (token, page = 1, limit = 10) => {
    const response = await apiClient.get('/history', {
        // 1. 쿼리 파라미터 (자동으로 /history?page=x&limit=y 로 변환됨)
        params: {
            page: page,
            limit: limit
        },
        // 2. 헤더 설정 (로그인 토큰)
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    // 백엔드 응답 구조: { list:Array, totalCount:Number }
    return response.data;
};

const getHistoryDetail = async (id, token) => {
	try {
		const response = await apiClient.get(`/history/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		return response.data;
	} catch (error) {
		console.error("Failed fetch history detail: ", error);
		throw error;
	}
};

export { 
    getHistoryDetail,
    getHistoryList,
    checkUsername, 
    signup, 
    apiLogin, 
    getUsername, 
    requestPasswordResetEmail,
    confirmPasswordReset,
    getCategories,
    searchProducts,
    getProductDetail,
    getProductVariants,
    calculateRanking
};