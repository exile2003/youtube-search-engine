import { useState, useEffect, memo, useRef, useCallback, useMemo } from 'react'
import {GridLoader, RingLoader} from 'react-spinners'
import moment from 'moment'
import { debounce, throttle } from 'lodash'
import './App.css'
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

    // const updateDateFrom = useCallback(
    //   setDateFrom
    // , [])

    const updateDateFrom = setDateFrom

    // const updateDateTo = useCallback(
    //   setDateTo, [])

    const updateDateTo = setDateTo

    // const updateItems = useCallback(
    //     setItems, [])

    const updateItems = setItems

    // const updateIsLoading = useCallback(
    //   setIsLoading, [])

    const updateIsLoading = setIsLoading

    // const updateTitle = useCallback(
    //   setTitle, [])

    const updateTitle = setTitle

    // const updateChannel = useCallback(
    //   setChannel, [])

    const updateChannel = setChannel

    // const myProps = {
    //   updateItems={updateItems} updateIsLoading={updateIsLoading} updateTitle={updateTitle} updateChannel={updateChannel} title={title} channel={channel}
    // }
 
    const myProps = {
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
    }
 
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