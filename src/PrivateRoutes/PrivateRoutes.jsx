import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router';
import LoadingSpinner from '../components/Loading/LoadingSpinner';


const PrivateRoutes = ({children}) => {

    const {user,loading} = useAuth()
    console.log(user)
     const location = useLocation()

    if(loading){
        return <LoadingSpinner></LoadingSpinner>
    }

    if(user){
     return children
    }
    return <Navigate state={location.pathname} to='/login'></Navigate>

    
    
};

export default PrivateRoutes;