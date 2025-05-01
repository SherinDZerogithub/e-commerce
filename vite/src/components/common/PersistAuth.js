import { checkAuth } from "@/store/auth-slice";
import { useEffect } from "react";
import { useDispatch} from "react-redux";



export default function PersistAuth() {

  const dispatch = useDispatch();
 

  useEffect(() => {
    // Verify authentication status on initial load
    const verifyAuth = async () => {
      try {
        await dispatch(checkAuth()).unwrap();
      } catch (error) {
        if (error.status !== 401) {
          console.error("Authentication check failed:", error);
        }
      }
    };

    verifyAuth();
  }, [dispatch]);

  return null;
}