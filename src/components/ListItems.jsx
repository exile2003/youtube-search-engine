import React, { useState, useEffect, memo, useRef, useCallback } from 'react'
import moment from 'moment'

function ListItem({ item }) {

   return (
        <li>
          <a href = {item.titleLink}>{item.title}</a> - 
          <a href = {item.channelLink}>{item.channel}</a> - 
          {moment(item.date, 'MMMM DD, YYYY, HH:mm:ss').format('MMMM-DD-YYYY')}     
        </li>
    )
        
}

const PureListItem = memo(ListItem)

function ListItems({ items }) {

  useEffect(() => console.count("render ListItems"))

    return (
        <div className="container" >
          <ul>
            {items?.map((item, inx) => 
                <PureListItem key={inx} item={item} />
            )}         
          </ul>
        </ div>      
    )
}

export default ListItems;