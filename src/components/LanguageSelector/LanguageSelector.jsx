import {useCallback, useEffect} from 'react'
import styles from './LanguageSelector.module.scss'
import { useTranslation } from 'react-i18next';


export default function LanguageSelector() {

      const { i18n, t } = useTranslation();
    
      const changeLanguage = useCallback((lng) => i18n.changeLanguage(lng), []);
    
      const indicateChoosedLanguage = (lng) => {
        const lang_links = document.querySelectorAll(`.${styles.lang_link}`);
        lang_links.forEach((item) => item.classList.remove(styles.lang_link_active));
        lang_links.forEach((item) => item.textContent.trim() === lng && item.classList.add(styles.lang_link_active));
      };
    

    const handleChangeLanguage = (e) => {
        e.preventDefault();
        changeLanguage(e.target.innerHTML);
        indicateChoosedLanguage(e.target.innerHTML);
        localStorage.setItem('selectedLanguage', e.target.innerHTML);
    };

     useEffect(() => {
    const selectedLanguage = localStorage.getItem('selectedLanguage');
    if (!selectedLanguage) {
      changeLanguage('en');
      indicateChoosedLanguage('en');
    } else {
      changeLanguage(selectedLanguage);
      indicateChoosedLanguage(selectedLanguage);
    }
  }, []);

  return (
     <div className={styles.language}>
        <div className={styles.lang_links}>
        <a className={styles.lang_link} onClick={(e) => handleChangeLanguage(e)}>en</a>
        <a className={styles.lang_link} onClick={(e) => handleChangeLanguage(e)}>ru</a>
        </div>
    </div>
  )
}
 