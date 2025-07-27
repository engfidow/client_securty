
import { Navigate } from 'react-router-dom';


const UnAuthenticatedRoutes = ({children , redirectTo="/"}) => {

    const token = localStorage.getItem('token');

    if(token){
        return <Navigate  to={redirectTo} replace />
    }
  return children;
}

export default UnAuthenticatedRoutes
