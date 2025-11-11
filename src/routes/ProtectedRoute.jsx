import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
	const { isLoggedIn, isLoading } = useAuth();
	const location = useLocation();

	if (isLoading) {
		// TODO : spinner 같은 것 반환?
		return null;
	}

	if (!isLoggedIn) {
		return <Navigate to='/login' state={{ from: location }} replace />;
	}

	return children;
};

export default ProtectedRoute;