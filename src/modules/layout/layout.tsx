import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styles from "./layout.module.css";
import { useEffect } from "react";
import { EXAM } from "../../const/exam";
import { ExamTypeRoute, RouterUrl } from "../../const/router";
import { NavigationContextProvider } from "../../contexts/navigation-context/navigation-context-provider";

export const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === RouterUrl.ROOT) {
      const pageUrl: RouterUrl = ExamTypeRoute[EXAM[1].type];
      const pageId: number = EXAM[1].id;
      navigate(`/${pageUrl}/${pageId}`);
    }
  }, [location, navigate]);

  return (
    <NavigationContextProvider>
      <div className={styles.container}>
        <Outlet />
      </div>
    </NavigationContextProvider>
  );
};
