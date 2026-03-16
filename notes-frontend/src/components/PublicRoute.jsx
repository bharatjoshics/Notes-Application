import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function PublicRoute({children}){
    const token = localStorage.getItem("token");

    if(!token){
        return children
    }

    try{
        const decoded = jwtDecode(token);
        const currentTime = Date.now()/1000;

        if(decoded < currentTime){
            localStorage.removeItem("token");
            return children;
        }

        return <Navigate to = "/" />;
    }

    catch(err){
        localStorage.removeItem("token");
        return children;
    }
};

export default PublicRoute;