import { useState, memo, useEffect, useCallback } from 'react'
import { flushSync } from 'react-dom';
import { RingLoader } from 'react-spinners'

import ListItems from '../Listitems/ListItems'
import Form from '../Form/Form'
import loadDB from '../../services/loadDB'
import styles from './App.module.scss';

import { useTranslation } from 'react-i18next';

//import classNames from 'classnames';

const MemoForm = memo(Form)
const MemoListItems = memo(ListItems)

function App() {

  console.log("App.");

  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const indicateChoosedLanguage = (lng) => {
    const lang_links = document.querySelectorAll(`.${styles.lang_link}`);
    lang_links.forEach(item => item.classList.remove(styles.lang_link_active));
    lang_links.forEach(item => item.textContent.trim() === lng && item.classList.add(styles.lang_link_active));
  }


  const handleChangeLanguage = (e) => {
    e.preventDefault();
    changeLanguage(e.target.innerHTML);
    indicateChoosedLanguage(e.target.innerHTML);
    localStorage.setItem('selectedLanguage', e.target.innerHTML)
  }
  
  const updateDB = useCallback(
    (value) => {
      setDB(value);
      console.log("updateDB -> setDB", value);
  }, [])

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataBase, setDB] = useState(() => loadDB('videos', 'youtubeDB', 'keyYoutubeDB', updateDB));

  console.log("isLoading", isLoading);

  useEffect(() => {
    const selectedLanguage = localStorage.getItem('selectedLanguage');
    if (!selectedLanguage) {
    changeLanguage('en');
    indicateChoosedLanguage('en');
    } else {
    changeLanguage(selectedLanguage);
    indicateChoosedLanguage(selectedLanguage);
    }
  }, [])

  const updateItems = useCallback(
      (value) => {
        //if (value.length == 0) alert("! БД нет")
        console.log("App. updateItems -> setItems", value)
        flushSync(() => setItems(value));
        //setItems(value);      
  }, [])

  const updateIsLoading = (value) => {
    console.log("App. updateIsLoading -> setIsLoading", value)
    flushSync(() => setIsLoading(value));
  }
    
  return ( 
    <>
    {isLoading && <div className={styles.spinner}><RingLoader /></div>}
      <div style = {isLoading ? {display: 'none'} : {}}>
        <div className={styles.language}>
          <div className={styles.lang_links}>
            <a className={styles.lang_link} onClick={(e) => handleChangeLanguage(e)}>en</a>
            <a className={styles.lang_link} onClick={(e) => handleChangeLanguage(e)}>ru</a>
          </div>
        </div>  
        <MemoForm updateItems={updateItems} updateIsLoading={updateIsLoading} updateDB={updateDB} dataBase = {dataBase} />
        <MemoListItems items={items} />
      </div>
    </>       
  )
}

export default App