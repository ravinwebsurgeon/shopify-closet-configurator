import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import"./ShelvingConfigurator.css"
import ConfigurationTab from '../ConfigurationTab/ConfigurationTab';
import ImageConfigurator from '../ImageConfigurator/ImageConfigurator';

const ShelvingConfigurator = () => {
  return (
    <>
    <div className="configurator-main-container">
        <div className='configurator-right-section'><ImageConfigurator/></div>
        <div className='configurator-left-section'>
            <div className="leftsec-comp-1"><ConfigurationTab/></div>
            <div className="leftsec-comp-3">
                <div className="left-comp3-row-container">
                    <button className="add-to-cart">Add to cart <FontAwesomeIcon icon={faAngleRight} /> </button>
                    <button className="total-price-container"> 
                        <div className="total-price-col-container">
                            <div className="total-price-row-conatiner">
                                <span className="total-pricing">€99.26</span>
                                <FontAwesomeIcon icon={faCircleInfo} />
                            </div>
                            <span className="total-vat-text">Excluding VAT</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default ShelvingConfigurator
