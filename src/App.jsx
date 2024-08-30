import { useState, useEffect, memo, useCallback } from 'react'
import {GridLoader, RingLoader} from 'react-spinners'
import moment from 'moment'
import { debounce, throttle } from 'lodash'
import ListItems from './components/ListItems'
import Form from './components/Form'
import loadDB from './services/loadDB'
import loadSmth from './services/loadSmth'


import './App.css'

const MemoForm = memo(Form)
const MemoListItems = memo(ListItems)

function App() {

  console.log("App.");

  const updateDB = useCallback(
    (value) => {
      setDB(value);
      console.log("updateDB -> setDB", value);
      (value == null || value == undefined)&&alert('БД отсутствует');
      (!value?.length)&&alert('БД пустая');
  }, [])

  //const [title, setTitle] = useState('');
  //const [channel, setChannel] = useState('');
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [db, setDB] = useState(() => loadDB('videos', 'youtubeDB3', 'keyYoutubeDB', updateDB));
  //const [db, setDB] = useState(() => loadSmth(5));

  /*
  const [db, setDB] = useState([{"channel":"The Companies Expert",
    "channelLink":"https://www.youtube.com/channel/UCHfYqxApaB6_DXCBuFSYG5w",
    "date":"24 мая 2024 г., 14:30:53 EET",
    "title":"What is your Weakness? | Best Answer (from former CEO)",
    "titleLink": "https://www.youtube.com/watch?v=yzWo8EXsfTs"}]);
  */
    

  useEffect(() => {
    //let res = returnSmth();
    //console.log("res?",res)
    //loadDB('videos', 'youtubeDB3', 'keyYoutubeDB', updateDB); 
    //console.log("res?",res);
    
    console.log("useEffect. App. db.", db);
    //setDB(res);
    //(!db)&&alert('БД отсутствует');
    //(!db?.length)&&alert('БД пустая');
  }, [db])
  //const [dateFrom, setDateFrom] = useState(() => '2017-01-01');
 //const [dateTo, setDateTo] = useState(() => moment().format('YYYY-MM-DD'));

    // const updateDateFrom = useCallback(
    //   setDateFrom
    // , [])

    // const updateDateTo = useCallback(
    //   setDateTo, [])

     const updateItems = useCallback(
         (value) => {
          setItems(value);
          console.log("App. updateItems -> setItems")
      }, [])

    //    const updateItems = setItems;

     const updateIsLoading = useCallback(
         (value) => {
          setIsLoading(value);
          console.log("App. updateIsLoading -> setIsLoading", value)
      }, [])

      

     //   const updateIsLoading = setIsLoading;

    //const memoItems = useMemo(() => items, [items])

    // const updateTitle = useCallback(
    //   setTitle, [])

    // const updateChannel = useCallback(
    //   setChannel, [])

    // const myProps = {
    //   updateItems={updateItems} updateIsLoading={updateIsLoading} updateTitle={updateTitle} updateChannel={updateChannel} title={title} channel={channel}
    // }
 
   
  return ( 
    <>
    {/* {isLoading && <div className="spinner"><RingLoader /></div>} */}
      {/* <div style = {isLoading ? {display: 'none'} : {}}> */}
      <div>
        <MemoForm updateItems={updateItems} updateIsLoading={updateIsLoading} db = {db} />
        <MemoListItems items={items} />
      </div>
    </>       
  )
}

export default App