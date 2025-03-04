import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const DirectionalLayout = ({ children }) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <div className={`${i18n.language === "ar" ? "rtl" : "ltr"}`}>
      {children}
    </div>
  );
};

export default DirectionalLayout;
