import { useState, useEffect } from 'react'
import moment from 'moment'
import debounce from 'lodash/debounce'
import './App.css'

let youtubeDB = [];
let tempDB =[];

let error, response = false;

let resource;


function App() {

  const [title, setTitle] = useState('');
  const [channel, setChannel] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [items, setItems] = useState([]);
/*
  const loadStatus = () => {
    console.log("load status");
    return new Promise(resolves => setTimeout(() => console.log("loaded"), 1000))
  };
*/


  const getFile = (e) => {
    
    const threeSecondsToGnar = new Promise(resolves => {

        const inputFile = e.target.files[0];
        const reader = new FileReader();
        reader.readAsText(inputFile);
      
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
          
          console.log("Yes!", youtubeDB)
          resolves(true)
        }
        

      });

      resource = createResource(threeSecondsToGnar);

      //pending.then(r => response = r);  

      //if(response) return;

      //throw pending;  
  }

  
  const handleSubmit = (event) => {
    event.preventDefault();

    tempDB = [];

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

    setItems(tempDB)

    console.log('Название:', title);
    console.log('Канал:', channel);
    console.log('Дата:', dateFrom, dateTo);
    console.log("youtubeDB", youtubeDB);
    console.log("tempDB", tempDB);
    console.log("items", items);
    console.log("----------------------------------")
    console.log("item.date", moment(items[1]?.date, 'MMMM DD, YYYY, HH:mm:ss').unix())
    console.log("dateFrom", moment(dateFrom, 'YYYY-MM-DD').unix())

  };

 
  const getId = (arg) => {
    const getid =  moment(arg, 'MMMM DD, YYYY, HH:mm:ss').unix() + String(Math.floor(Math.random()*1000));
    //console.log("getid", getid);
    return Number(getid)
  }
 
  /*
  const loadStatus = (function() {
    let error, response;
    const promise = new Promise(resolves =>
    setTimeout(resolves, 3000)
    )
    .then(() => (response = "success"))
    .catch(e => (error = e));
    return function() {
    if (error) throw error;
    if (response) return response;
    throw pending;
    };
   })()
  */

   
   function createResource(pending) {
    
    pending.then(r => (response = r)).catch(e => (error = e));
      return {
        read() {
        if (error) throw error;
        if (response) return response;
        throw pending;
        }
      };
   }
  

   /*
   function createResource(pending) {
    
    pending.then(r => (response = r)).catch(e => (error = e));
      
        if (error) throw error;
        if (response) return response;
        throw pending;
    
   }
*/

  //const threeSecondsToGnar = new Promise(resolves => setTimeout( () => resolves({ gnar: "gnarly!" }), 3000 ))
  
  //const resource = createResource(threeSecondsToGnar);

 const result = resource.read()

/*
  function Gnar() {
    const result = resource.read();
    return <h1>Gnar: {result.gnar}</h1>;
  }
*/
  
  //const status = loadStatus();
  //const statusResult = status.then(data => data)

  return ( 
    <>
       <div className="container">
        <div className="header">
          <h2>Youtube videos</h2>
          <label htmlFor="chooseFile">
            <input onChange= {getFile} type="file" name="chooseFile" id="chooseFile"  />
            <button >Обновить базу данных</button>
          </label>
       </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Название:&nbsp;&nbsp;</label>
            <input type="text" onChange={debounce((e) => setTitle(e.target.value), 1000)} />
          </div>
          <div>
            <label>Название канала:&nbsp;&nbsp;</label>
            <input type="text" onChange={debounce((e) => setChannel(e.target.value), 1000)} />
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
          {items?.map(item =>  
          <li key={getId(item.date)} >
            <a href = {item.titleLink}>{item.title}</a> - 
            <a href = {item.channelLink}>{item.channel}</a> - 
            {moment(item.date, 'MMMM DD, YYYY, HH:mm:ss').format('MMMM-DD-YYYY')}
          </li>)}
        </ul>
      </div>
    </> 
          
  )
}

export default App
