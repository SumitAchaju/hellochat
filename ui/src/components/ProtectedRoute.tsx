import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useUserStore } from "../store/userStore";

type Props = {};

export default function ProtectedRoute({}: Props) {
  const { loginStatus } = useUserStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loginStatus) {
      navigate("/login");
    }
  }, [loginStatus]);
  return <>{loginStatus ? <Outlet /> : null}</>;
}
