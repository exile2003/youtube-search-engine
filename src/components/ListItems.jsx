import React, { useState, useEffect, memo, useRef, useCallback } from 'react'
import { FixedSizeList } from "react-window";
import moment from 'moment'

function ListItem({ item }) {
  console.count("render ListItem ");
   return (
        <li>
          <a href = {item.titleLink}>{item.title}</a> - 
          <a href = {item.channelLink}>{item.channel}</a> - 
          {moment(item.date, 'MMMM DD, YYYY, HH:mm:ss').format('MMMM-DD-YYYY HH:mm:ss')}     
        </li>
    )
        
}

const MemoListItem = memo(ListItem)

function ListItems({ items }) {

  useEffect(() => console.count("render ListItems"))

    return (
         <div className="container" >
          
          <FixedSizeList
            innerElementType="ul"
            height={innerHeight}
            width={innerWidth - 60}
            itemCount={items.length}
            itemSize={30}
            itemData = {items}
          >
            
   {/*                         
              {items?.map((item, inx) => 
                  <ListItem key={item.title + (moment(item.date, 'MMMM DD, YYYY, HH:mm:ss').unix()).toString()} item={item} />
                  // <MemoListItem key={inx} item={item} />
              )}          
     */}      

          {({data, index, style}) => (
          
         
            <li style={style} >
              <a href = {data[index].titleLink}>{data[index].title}</a> - 
              <a href = {data[index].channelLink}>{data[index].channel}</a> - 
              {moment(data[index].date, 'MMMM DD, YYYY, HH:mm:ss').format('MMMM-DD-YYYY HH:mm:ss')}  
              
            </li>
        
          )}
   
            
          </FixedSizeList>
          
        </ div>      
    )
}

export default ListItems;