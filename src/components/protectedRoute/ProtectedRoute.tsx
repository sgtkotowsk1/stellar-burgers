import { Preloader } from "@ui";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "src/services/store";

// export const ProtectedRoute = ({accessRoles}: {accessRoles: Role[]}) => {
//     const { isInit, isLoading, user } = useSelector((store: RootState) => store.user);
   
//     if (isLoading && isInit) {
//         return <Preloader />;
//     }
//     if (!user || !accessRoles.includes(user.role)) {
//        return <Navigate replace to='/sign-in'/>; 
//     } 

//     return <Outlet/>;
// };