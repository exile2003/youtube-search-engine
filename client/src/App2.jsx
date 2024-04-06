import { useState, useEffect, memo, useRef, useCallback } from 'react'
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

    const updateItems = useCallback((value) => {
        setItems(value)
    }, [])

    const updateIsLoading = useCallback((value) => {
      setIsLoading(value)
  }, [])

  const updateTitle = useCallback((value) => {
    setTitle(value)
}, [])

const updateChannel = useCallback((value) => {
  setChannel(value)
}, [])
 
  

     if (isLoading) return <>
        <div className="spinner"><RingLoader /></div>
        {/* <div className="spinner2"></div> */}
     </>

  return ( 
    <>
      <PureForm updateItems={updateItems} updateIsLoading={updateIsLoading} updateTitle={updateTitle} updateChannel={updateChannel} title={title} channel={channel} />
      <ListItems items={items} />
    </>       
  )
}

export default App2