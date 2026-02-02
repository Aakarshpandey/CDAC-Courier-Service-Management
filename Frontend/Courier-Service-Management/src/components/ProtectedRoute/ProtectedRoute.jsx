import { Navigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";

function ProtectedRoute({ children }) {
  
  const { authUser } = useAuth()

  return authUser ? children : <Navigate to='/login' />
}

export default ProtectedRoute;
