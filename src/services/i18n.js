import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      "welcome": "Welcome",
      "Youtube videos": "Youtube videos",
      "Video title:": "Video title:",
      "Channel title:": "Channel title:",
      "Date:": "Date:",
      "from": "from",
      "to": "to",
      "Eliminate repetition": "Eliminate repetition",
      "Download data": "Download data",
      "Dates reset": "Dates reset",
      "Search": "Search"
    }
  },
  ru: {
    translation: {
      "welcome": "Добро пожаловать",
      "Youtube videos": "Youtube videos",
      "Video title:": "Название видео:",
      "Channel title:": "Название канала:",
      "Date: ": "Дата:",
      "from": "от",
      "to": "до",
      "Eliminate repetitions": "Исключить повторения",
      "Download data": "Загрузить данные",
      "Dates reset": "Сброс дат",
      "Search": "Поиск",
      "Number of found videos: ": "Количество найденных видео: ",
      "No database available": "База данных отсутствует",
      'Click the "Download data" button and select the html data file previously downloaded from your YouTube account.':'Нажмите кнопку "Загрузить данные" и выберите предварительно скачанный с аккаунта YouTube файл с данными в формате html.'
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;