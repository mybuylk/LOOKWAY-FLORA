import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export const useCart = () => {
  const { user, token } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  // Fetch cart count from sync or local state for now
  useEffect(() => {
    // Basic logic
    setCartCount(0);
  }, [user]);

  return { cartCount };
};
