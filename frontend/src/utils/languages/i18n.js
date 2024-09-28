import i18n from "i18next";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

import translationEN from "../translation/en.json";
import translationVI from "../translation/vi.json";
import translationGermany from "../translation/germany.json";
import translationChina from "../translation/china.json";
import translationEstonian from "../translation/estonian.json";
import translationRussian from "../translation/russian.json";

const resources = {
  en: {
    translation: translationEN,
  },
  vi: {
    translation: translationVI,
  },
  ger: {
    translation: translationGermany,
  },
  china: {
    translation: translationChina,
  },
  esto: {
    translation: translationEstonian,
  },
  rus: {
    translation: translationRussian,
  },
};

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en", // Ngôn ngữ dự phòng nếu ngôn ngữ hiện tại không có sẵn
    debug: true,
    interpolation: {
      escapeValue: true, // not needed for react as it escapes by default
    },
  });

export default i18n;
