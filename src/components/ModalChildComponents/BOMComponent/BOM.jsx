import React from 'react'

const BOM = ({data,totalPrice}) => {

  const convertPrice = (price) =>{
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  }

  return (
    <>
      {data.map((item,index)=>(
            <div className="item-container flex justify-between mb-2" key={index}>
                <div className='flex items-center gap-2'>
                    <div className="countdiv bg-[#EB6200] px-[10px] py-[5px] rounded-[50%] font-inter font-medium text-[12px] text-[white]">{item.quantity}</div>
                    <span className='font-inter font-medium text-[12px]'> x </span>
                    <div className="compLabel flex gap-2 font-inter font-medium text-[12px] items-center">
                        <span className="comlabel">{item.component}</span>
                        <span className="dimlabel  bg-[#EB6200] px-[10px] py-[3px] rounded-[2px] text-[white]">{item.dimensions}</span>
                    </div>
                </div>
                <div className="pricing font-inter font-medium text-[12px]">
                    <span className="pricing">{convertPrice(item.totalPrice)}</span>
                </div>
            </div>
      ))}
      <hr className="border-t border-[#40404054]"/>
      <div className="total-conatiner flex justify-between mt-2">
        <span className="font-inter font-medium">Totaalbedrag</span>
        <div className='flex flex-col'>
            <span className="font-inter font-medium">{totalPrice}</span>
            <span className="font-inter font-medium text-[9px] text-[#939393]">Exclusief BTW</span>
        </div>
      </div>
    </>
  )
}

export default BOM
