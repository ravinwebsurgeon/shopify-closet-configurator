import React from 'react'
import './BackWall.css'
import { useDispatch } from 'react-redux';
import rearwallSolid from '../../assets/re'
const BackWall = () => {

    const dispatch = useDispatch();
    const cardData = [
        {id:"perfo" , imgSrc:sidewallPerfo,label:"Sidewall Perfo"},
        {id:"closed" , imgSrc:sidewallClosed,label:"Sidewall Closed "}
    ]


  return (
    <></>
  )
}

export default BackWall
