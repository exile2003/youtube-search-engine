import { useState, useEffect } from 'react'
import './App.css'

let youtubeDB = []

function App() {

  const [input, setInput] = useState('');
  const [title, setTitle] = useState('');
  const [channel, setChannel] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [items, setItems] = useState([]);

  const updateDataBase = (e) => {
      getFile(e)
  }


  const getFile = (e) => {
    const inputFile = e.target.files[0];
    const reader = new FileReader();
  
    reader.readAsText(inputFile);
    reader.onload = (event) => {
      const fileContent = event.target.result;
  
      // Parsing the content of the input file and assign result to domTree variable
      const domTree = new DOMParser().parseFromString(fileContent, 'text/html');
  
      // Pass the content of tag body to function elementIteration for adding dates
      //elementIteration(domTree.getElementsByTagName('body')[0]);

      const allSelectors = domTree.querySelectorAll('.content-cell.mdl-cell--6-col');

      allSelectors.forEach(item => item.children[0] && youtubeDB.push({
        title: item.children[0]?.textContent,
        channel: item.children[2]?.textContent,
        date: item.lastChild?.textContent
      }));
      
      //const arrayTitle = domTree.querySelectorAll('.content-cell')[0].children
      //const textValue = domTree.querySelectorAll('.content-cell')[0].lastChild.textContent

      console.log("Yes!")
    };
  }

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleChannelChange = (event) => {
    setChannel(event.target.value);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleTimeChange = (event) => {
    setTime(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Здесь можно выполнить какую-то логику поиска
    console.log('Название:', title);
    console.log('Дата:', date);
    console.log('Время:', time);
  };

  const inputSearch = document.getElementById('searchTitle')

  useEffect(() => {
    console.log(items);
    setItems(youtubeDB.filter(item => item.title?.toLowerCase().includes(title.toLowerCase())))
}, [title])

useEffect(() => {
  console.log(items);
  setItems(youtubeDB.filter(item => item.channel?.toLowerCase().includes(channel.toLowerCase())))
}, [channel])



  return (
    <>
      <div className="container">
        <div className="header">
          <h2>Youtube videos</h2>
          <label htmlFor="chooseFile">
            <input onChange= {getFile} type="file" name="chooseFile" id="chooseFile"  />
            <button onClick = {updateDataBase}>Обновить базу данных</button>
          </label>
          
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Название:&nbsp;&nbsp;</label>
            <input type="text" value={title} onChange={handleTitleChange} />
          </div>
          <div>
            <label>Название канала:&nbsp;&nbsp;</label>
            <input type="text" value={channel} onChange={handleChannelChange} />
          </div>
          <div>
            <label>Дата:&nbsp;&nbsp;</label>
            <input type="date" value={date} onChange={handleDateChange} />
          </div>
          <div>
            <label>Время:&nbsp;&nbsp;</label>
            <input type="time" value={time} onChange={handleTimeChange} />
          </div>
          <button type="submit">Искать</button>
        </form>
        <ul>
          {items.map(item =>  <li>{item.title} - {item.channel} - {item.date}</li> )}
        </ul>
      </div>
    </>
          
  )
}

export default App
