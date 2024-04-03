import { useState, useEffect, memo, useRef } from 'react'
import {GridLoader, RingLoader} from 'react-spinners'
import moment from 'moment'
import { debounce, throttle } from 'lodash'
import './App.css'

let youtubeDB = [];
let tempDB =[];

let error, response = false;

let resource;


function App3() {

  //const [title, setTitle] = useState('');
  //const [channel, setChannel] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [items, setItems] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const txtTitle = useRef();
  const txtChannel = useRef();

/*
  const handleChannel = (event) => {
    const { value } = event.target;
    setChannel(value);
  }


  function handleChannel(event) {
    const { value } = event.target;
    setChannel(value);
  }
*/

  const handleFileUpload = (event) => {
    setIsLoading(true);
    const file = event.target.files[0];

    // Здесь можно выполнить логику загрузки файла
    try {
      // Предположим, что у вас есть функция для загрузки файла
            if(file) getFile(file);
    } catch (error) {
      console.error('Ошибка загрузки файла:', error);
    } finally {
      //setIsLoading(false);
    }
  }

  const getFile = (file) => {
    
        //const inputFile = e.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file);
      
        reader.onload = (event) => {
          const fileContent = event.target.result;
      
          // Parsing the content of the input file and assign result to domTree variable
          const domTree = new DOMParser().parseFromString(fileContent, 'text/html');
      
          // Pass the content of 'content-cell' and 'mdl-cell--6-col' classes to array allSelectors
          const allSelectors = domTree.querySelectorAll('.content-cell.mdl-cell--6-col');

          allSelectors.forEach(item => item.children[0] && youtubeDB.push({
            title: item.children[0]?.textContent,
            titleLink: item.children[0]?.href,
            channel: item.children[2]?.textContent,
            channelLink: item.children[2]?.href,
            date: item.lastChild?.textContent
          }));
          
          console.log("Yes!", youtubeDB);
          setIsLoading(false)
        }    
  }

  const handleSubmit = (event) => {

    setIsLoading(true);

    event.preventDefault();

    tempDB = [];

    const title = txtTitle.current.value;
    const channel = txtChannel.current.value;

    tempDB = youtubeDB
                .filter(item => item.title?.toLowerCase().includes(title.trim().toLowerCase()))
                .filter(item => item.channel?.toLowerCase().includes(channel.trim().toLowerCase()))
                .filter(item => 
                  item.date&&dateFrom 
                    ? moment(item?.date, 'MMMM DD, YYYY, HH:mm:ss').unix() >= moment(dateFrom, 'YYYY-MM-DD').unix() 
                    : true
                )
                .filter(item => 
                  item.date&&dateTo 
                    ? moment(item?.date, 'MMMM DD, YYYY, HH:mm:ss').unix() <= moment(dateTo, 'YYYY-MM-DD').unix() + 86400 
                    : true
                )
              //  .filter(item => { setIsLoading(false); return true })

    setItems(tempDB)
    setTimeout(() => setIsLoading(false), 0)

    console.log('Название:', title);
    console.log('Канал:', channel);
    console.log('Дата:', dateFrom, dateTo);
    console.log("youtubeDB", youtubeDB);
    console.log("tempDB", tempDB);
    console.log("items", items);
    console.log("----------------------------------")
    console.log("item.date", moment(items[1]?.date, 'MMMM DD, YYYY, HH:mm:ss').unix())
    console.log("dateFrom", moment(dateFrom, 'YYYY-MM-DD').unix())
    console.log("isLoading", isLoading)

  };

  //const PureListItem = memo(ListItem)
  
 

     if (isLoading) return <>
        <div className="spinner"><RingLoader /></div>
        {/* <div className="spinner2"></div> */}
     </>

  return ( 
    <>
       <div className="container">
        <div className="header">
          <h2>Youtube videos</h2>
          <label htmlFor="chooseFile">
            <input onChange= {handleFileUpload} type="file" name="chooseFile" id="chooseFile"  />
            <button >Обновить базу данных</button>
          </label>
       </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Название:&nbsp;&nbsp;</label>
            <input ref ={txtTitle} type="text" /> {/*onChange={(e) => setTitle(e.target.value)}*/}
          </div>
          <div>
            <label>Название канала:&nbsp;&nbsp;</label>
            <input ref ={txtChannel} type="text" /> {/*  onChange={throttle((e) => setChannel(e.target.value), 1000)} */}
          </div>
          <div>
            <label>Дата:&nbsp;&nbsp;</label>
            от&nbsp;
            <input type="date" onChange={debounce((e) => setDateFrom(e.target.value), 100)} />
            &nbsp;до&nbsp;
            <input type="date" onChange={debounce((e) => setDateTo(e.target.value), 100)} />
          </div>
          <button type="submit">Искать</button>
        </form>
        <ul>
          {items?.map(item => <ListItem item={item} />)}
        </ul>
      </div>
    </> 
        
  )
}

export default App3

function ListItem({ item }) {

    const getId = (arg) => {
        const getid =  moment(arg, 'MMMM DD, YYYY, HH:mm:ss').unix() + String(Math.floor(Math.random()*1000));
       // console.log("getid", getid);
        return Number(getid)
      }

    return (
        <li key={getId(item.date)} >
        <a href = {item.titleLink}>{item.title}</a> - 
        <a href = {item.channelLink}>{item.channel}</a> - 
        {moment(item.date, 'MMMM DD, YYYY, HH:mm:ss').format('MMMM-DD-YYYY')}
        </li>
    )
    
}
