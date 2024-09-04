import { useState, useEffect, memo, useCallback } from 'react'
import {GridLoader, RingLoader} from 'react-spinners'
import moment from 'moment'
import { debounce, throttle } from 'lodash'
import ListItems from './components/ListItems'
import Form from './components/Form'
import loadDB from './services/loadDB'
//import styles from './App.module.css';
import './App.css'

//import 'materialize-css'
import { Modal } from './components/Modal';


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
  const [db, setDB] = useState(() => loadDB('videos', 'youtubeDB', 'keyYoutubeDB', updateDB));
/*
  useEffect(() => {
      
    console.log("useEffect. App. db.", db);
    
  }, [db])
*/
  const updateItems = useCallback(
      (value) => {
      setItems(value);
      console.log("App. updateItems -> setItems")
  }, [])

  const updateIsLoading = useCallback(
      (value) => {
      setIsLoading(value);
      console.log("App. updateIsLoading -> setIsLoading", value)
  }, [])
    
  return ( 
    <>
    {isLoading && <div className="spinner"><RingLoader /></div>}
      <div style = {isLoading ? {display: 'none'} : {}}>
        <MemoForm updateItems={updateItems} updateIsLoading={updateIsLoading} db = {db} />
        <MemoListItems items={items} />
        <Modal/>
      </div>
    </>       
  )
}

export default App