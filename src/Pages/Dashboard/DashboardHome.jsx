import React from 'react';
import useRole from '../../hooks/useRole';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import AdminDashboard from './AdminDashboard';
import DecoratorDashboard from './DecoratorDashboard';
import UserDashboard from './UserDashboard';

const DashboardHome = () => {
    const {role,roleLoading} = useRole()
    
            if(roleLoading){
                return <LoadingSpinner></LoadingSpinner>
            }
            else if(role === 'admin'){
                return <AdminDashboard></AdminDashboard>
            }
            else if(role === 'decorator'){
                return <DecoratorDashboard></DecoratorDashboard>
            }
            else{
                return <UserDashboard></UserDashboard>
    
}};

export default DashboardHome;