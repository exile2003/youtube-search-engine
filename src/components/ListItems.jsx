import React from 'react'
import { FixedSizeList } from "react-window";
import moment from 'moment'

// function ListItem({ item }) {
//   console.count("render ListItem ");
//    return (
//         <li>
//           <a href = {item.titleLink}>{item.title}</a> - 
//           <a href = {item.channelLink}>{item.channel}</a> - 
//           {moment(item.date, 'DD MMMM YYYY, HH:mm:ss').format('MMMM-DD-YYYY HH:mm:ss')}     
//         </li>
//     )
        
// }

// const MemoListItem = memo(ListItem)

function ListItems({ items }) {

  let dateFormat = '';
  if(items[0]?.date.split('')[0].charCodeAt() < 57) {
    moment.locale('ru');
    dateFormat = 'DD MMMM YYYY, HH:mm:ss';
  } else {
    moment.locale('en');
    dateFormat = 'MMMM DD YYYY, HH:mm:ss';
  }

    return (
          <FixedSizeList
            innerElementType="ul"
            height={innerHeight - 300}
            width={innerWidth -40}
            itemCount={items.length}
            itemSize={30}
            itemData = {items}
            style = {{overflowX: 'hidden', }}
          >
            
   {/*                         
              {items?.map((item, inx) => 
                  <ListItem key={item.title + (moment(item.date, 'MMMM DD, YYYY, HH:mm:ss').unix()).toString()} item={item} />
                  // <MemoListItem key={inx} item={item} />
              )}          
  */}      

          {({data, index, style}) => (
          
         
            <li style={style} >
              <a href = {data[index].titleLink}>{data[index].title}</a> - &nbsp;
              <a href = {data[index].channelLink}>{data[index].channel}</a> - &nbsp;
              {moment(data[index].date, dateFormat).format('MMMM-DD-YYYY HH:mm:ss')}  
              
            </li>
        
          )}
   
            
          </FixedSizeList>
    )
}

export default ListItems;