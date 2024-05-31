import { useState, useEffect, memo, useCallback } from 'react'
import {GridLoader, RingLoader} from 'react-spinners'
import moment from 'moment'
import { debounce, throttle } from 'lodash'
import ListItems from './components/ListItems'
import Form from './components/Form'


import './App.css'

const MemoForm = memo(Form)
const MemoListItems = memo(ListItems)

function App() {

  useEffect(() => alert('загрузи БД'), [])
  
  //const [title, setTitle] = useState('');
  //const [channel, setChannel] = useState('');
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
          console.log("change items")
      }, [])

    //    const updateItems = setItems;

     const updateIsLoading = useCallback(
         (value) => {
          setIsLoading(value);
          console.log("change isLoading", value)
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
    {isLoading && <div className="spinner"><RingLoader /></div>}
      <div style = {isLoading ? {display: 'none'} : {}}>
        <MemoForm updateItems={updateItems} updateIsLoading={updateIsLoading} />
        <MemoListItems items={items} />
      </div>
    </>       
  )
}

export default App