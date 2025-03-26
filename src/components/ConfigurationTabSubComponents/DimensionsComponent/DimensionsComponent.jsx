import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setConfiguration } from '../../../slices/shelfDetailSlice';
import './DimensionsComponent.css'


const DimensionsComponent = () => {

    const configuration = useSelector((state) => state.shelfDetail.configuration);
    const dispatch = useDispatch();

    const [dimensions, setDimensions] = useState({
        width: configuration?.width || dimensionOptions.width[0],
        height: configuration?.height || dimensionOptions.height[0],
        depth: configuration?.depth || dimensionOptions.depth[0]
      });

  // Predefined values for each dimension
  const dimensionOptions = {
    width: [55, 70, 85, 100, 115, 130],
    height: [100, 120, 150, 200, 220, 250, 300],
    depth: [20, 30, 40, 50, 60, 70, 80]
  };

  const handleDimensionChange = (dimension, value) => {
    const newValue = parseInt(value);
    const newDimensions = { ...dimensions, [dimension]: newValue };
    setDimensions(newDimensions);
    
    // Update Redux store with new configuration
    dispatch(setConfiguration({
      ...configuration,
      ...newDimensions
    }));
  };




  const calculateSliderStyle = (value, options) => {
    const index = options.indexOf(value);
    const percentage = (index / (options.length - 1)) * 100;
    return { '--value-percent': `${percentage}%` };
  };


  return (
    <>
      <div className="dimensions-content">
      <div className="dimension-row">
        <label>Width</label>
        <div className="dimension-control">
          <span>{dimensions.width} cm</span>
          <div className="slider-container">
            <input 
              type="range" 
              min="0"
              max={dimensionOptions.width.length - 1}
              value={dimensionOptions.width.indexOf(dimensions.width)}
              className="dimension-slider"
              style={calculateSliderStyle(dimensions.width, dimensionOptions.width)}
              onChange={(e) => handleDimensionChange('width', dimensionOptions.width[e.target.value])}
            />
          </div>
        </div>
      </div>
      
      <div className="dimension-row">
        <label>Height</label>
        <div className="dimension-control">
          <span>{dimensions.height} cm</span>
          <div className="slider-container">
            <input 
              type="range" 
              min="0"
              max={dimensionOptions.height.length - 1}
              value={dimensionOptions.height.indexOf(dimensions.height)}
              className="dimension-slider"
              style={calculateSliderStyle(dimensions.height, dimensionOptions.height)}
              onChange={(e) => handleDimensionChange('height', dimensionOptions.height[e.target.value])}
            />
          </div>
        </div>
      </div>
      
      <div className="dimension-row">
        <label>Depth</label>
        <div className="dimension-control">
          <span>{dimensions.depth} cm</span>
          <div className="slider-container">
            <input 
              type="range" 
              min="0"
              max={dimensionOptions.depth.length - 1}
              value={dimensionOptions.depth.indexOf(dimensions.depth)}
              className="dimension-slider"
              style={calculateSliderStyle(dimensions.depth, dimensionOptions.depth)}
              onChange={(e) => handleDimensionChange('depth', dimensionOptions.depth[e.target.value])}
            />
          </div>
        </div>
      </div>

      <div className="dimension-note">
        The depth indicated above applies to the entire cabinet. It is possible that parts may be removed as a result of the resizing.
      </div>
    </div>
    </>
  )
}

export default DimensionsComponent
