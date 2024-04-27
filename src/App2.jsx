import { useState, useEffect, memo, useRef, useCallback, useMemo } from 'react'
import {GridLoader, RingLoader} from 'react-spinners'
import moment from 'moment'
import { debounce, throttle } from 'lodash'
//import './App.css'
import ListItems from './components/ListItems'
import Form from './components/Form'


const PureForm = memo(Form)

function App2() {

  const [title, setTitle] = useState('');
  const [channel, setChannel] = useState('');
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [dateFrom, setDateFrom] = useState(() => '2017-01-01');
  const [dateTo, setDateTo] = useState(() => moment().format('YYYY-MM-DD'));

    const updateDateFrom = useCallback(
      setDateFrom
    , [])

    const updateDateTo = useCallback(
      setDateTo, [])

    const updateItems = useCallback(
        setItems, [])

    const updateIsLoading = useCallback(
      setIsLoading, [])

    const updateTitle = useCallback(
      setTitle, [])

    const updateChannel = useCallback(
      setChannel, [])

    // const myProps = {
    //   updateItems={updateItems} updateIsLoading={updateIsLoading} updateTitle={updateTitle} updateChannel={updateChannel} title={title} channel={channel}
    // }
 
    const myProps = useMemo(() => ({
        updateDateFrom,
        updateDateTo,
        updateItems, 
        updateIsLoading, 
        updateTitle, 
        updateChannel,
        dateFrom,
        dateTo, 
        title, 
        channel
    }), [
      dateFrom,
        dateTo, 
        title, 
        channel
    ])
 

     if (isLoading) return <>
        <div className="spinner"><RingLoader /></div>
        {/* <div className="spinner2"></div> */}
     </>

  return ( 
    <>
      <PureForm {...myProps} />
      <ListItems items={items} />
    </>       
  )
}

export default App2