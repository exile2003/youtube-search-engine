import { useState, useEffect, memo, useCallback } from 'react'
import { flushSync } from 'react-dom';
import { RingLoader } from 'react-spinners'

import ListItems from './components/ListItems'
import Form from './components/Form'
import loadDB from './services/loadDB'
import styles from './App.module.scss';

const MemoForm = memo(Form)
const MemoListItems = memo(ListItems)

function App() {

  console.log("App.");
  
  const updateDB = useCallback(
    (value) => {
      setDB(value);
      console.log("updateDB -> setDB", value);
  }, [])

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataBase, setDB] = useState(() => loadDB('videos', 'youtubeDB', 'keyYoutubeDB', updateDB));
  //const [dbDisabled, setDbDisabled] = useState(false);
  console.log("isLoading", isLoading);

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
      //setIsLoading(value);
      
  }
    
  return ( 
    <>
    {isLoading && <div className={styles.spinner}><RingLoader /></div>}
      <div style = {isLoading ? {display: 'none'} : {}}>
        <MemoForm updateItems={updateItems} updateIsLoading={updateIsLoading} updateDB={updateDB} dataBase = {dataBase} />
        <MemoListItems items={items} />
      </div>
    </>       
  )
}

export default App