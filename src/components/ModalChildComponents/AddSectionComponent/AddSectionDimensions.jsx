import React from "react";

const AddSectionDimensions = ({ dimensions, setDimensions }) => {
  // Predefined values for each dimension
  const dimensionOptions = {
    width: [55, 70, 85, 100, 115, 130],
    height: [100, 120, 150, 200, 220, 250, 300],
    depth: [20, 30, 40, 50, 60, 70, 80],
  };

  const handleDimensionChange = (dimension, value) => {
    const newValue = parseInt(value);
    setDimensions((prev) => ({ ...prev, [dimension]: newValue }));
  };

  const calculateSliderStyle = (value, options) => {
    const index = options.indexOf(Number(value));
    const percentage = (index / (options.length - 1)) * 100;
    return { "--value-percent": `${percentage}%` };
  };

  return (
    <div className="dimensions-content flex flex-col gap-4">
      <div className="dimension-row">
        <label className="font-inter text-xs w-[130px] h-[31px] bg-[#F8F8F8] rounded-[5px] tracking-normal  text-black font-normal leading-none justify-center flex items-center  gap-3">
          Width
          <span className="font-inter text-xs tracking-normal  text-black font-semibold leading-none ">
            {dimensions.width} cm
          </span>
        </label>
        <div className="dimension-control">
          <div className="slider-container">
            <input
              type="range"
              min="0"
              max={dimensionOptions.width.length - 1}
              value={dimensionOptions.width.indexOf(dimensions.width)}
              className="dimension-slider"
              style={calculateSliderStyle(
                dimensions.width,
                dimensionOptions.width
              )}
              onChange={(e) =>
                handleDimensionChange(
                  "width",
                  dimensionOptions.width[e.target.value]
                )
              }
            />
          </div>
        </div>
      </div>

      <div className="dimension-row">
        <label className="font-inter text-xs w-[130px] h-[31px] bg-[#F8F8F8] rounded-[5px] tracking-normal  text-black font-normal leading-none justify-center flex items-center  gap-3">
          Height
          <span className="font-inter text-xs tracking-normal  text-black font-semibold leading-none ">
            {dimensions.height} cm
          </span>
        </label>
        <div className="dimension-control">
          <div className="slider-container">
            <input
              type="range"
              min="0"
              max={dimensionOptions.height.length - 1}
              value={dimensionOptions.height.indexOf(dimensions.height)}
              className="dimension-slider"
              style={calculateSliderStyle(
                dimensions.height,
                dimensionOptions.height
              )}
              onChange={(e) =>
                handleDimensionChange(
                  "height",
                  dimensionOptions.height[e.target.value]
                )
              }
            />
          </div>
        </div>
      </div>

      <div className="dimension-row">
        <label className="font-inter text-xs w-[130px] h-[31px] bg-[#F8F8F8] rounded-[5px] tracking-normal  text-black font-normal leading-none justify-center flex items-center  gap-3">
          Depth
          <span className="font-inter text-xs tracking-normal  text-black font-semibold leading-none ">
            {dimensions.depth} cm
          </span>
        </label>
        <div className="dimension-control">
          <div className="slider-container">
            <input
              type="range"
              min="0"
              max={dimensionOptions.depth.length - 1}
              value={dimensionOptions.depth.indexOf(dimensions.depth)}
              className="dimension-slider"
              style={calculateSliderStyle(
                dimensions.depth,
                dimensionOptions.depth
              )}
              onChange={(e) =>
                handleDimensionChange(
                  "depth",
                  dimensionOptions.depth[e.target.value]
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSectionDimensions;
