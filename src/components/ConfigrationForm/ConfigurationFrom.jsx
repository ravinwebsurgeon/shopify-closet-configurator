import React, { useState } from "react";
import {
  faArrowsLeftRight,
  faArrowsUpDown,
  faArrowUpRightDots,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import "./ConfiguraionForm.css";
import FormInputField from "./FormInputField";
import { useDispatch, useSelector } from "react-redux";
import logo from '../../assets/pointing.png'
import { setConfiguration, setSection } from "../../slices/shelfDetailSlice";

const ConfigurationFrom = () => {

  const dispatch = useDispatch()
  const options = useSelector((state) => state.shelfDetail.options)
  const [formData, setFormData] = useState({
    height: "",
    width: "",
    depth: "",
    shelfCount: "",
  });

  const heightArr = [
    {"100":"57"},
    {"120":"67"},
    {"150":"82"},
    {"180":"97"},
    {"200":"107"},
    {"210":"112"},
    {"220":"117"},
    {"240":"127"},
    {"250":"132"},
    {"300":"157"},
  ]

  const [positionArr , setPositionArr] = useState([]);
  const [racks, setRacks] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // function used to set shelves at a specific height
  const GeneratePosArr = (currShelfHeight, shelfCount)=>{
    const Result = heightArr.find(obj => obj[currShelfHeight] !== undefined)
    const heightResult = parseInt(Object.values(Result)[0])
    
    const positions =[];
    
    for (let i = 0; i < shelfCount; i++) {
      const topPosition = ((heightResult - 9.5)/(shelfCount-1))*i
      positions.push({
        zIndex:shelfCount-i,
        top:`${topPosition}em`
      })
    }
    return positions;
  }

  // function used to calculate no. of racks
  const findOptimizedRacks = (totalWidth) => {
    let bestCombination = null;
    const availableWidths = [100, 130, 115, 85, 70, 55];
  
    const findCombination = (remaining, combination = []) => {
      if (remaining === 0) {
        if (!bestCombination || combination.length < bestCombination.length) {
          bestCombination = [...combination];
        }
        return;
      }
  
      for (let width of availableWidths) {
        if (remaining >= width) {
          findCombination(remaining - width, [...combination, width]);
        }
      }
    };
  
    findCombination(totalWidth);
    
    if (totalWidth === 230) return [115, 115]; 
  
    return bestCombination || [];
  };



  const handleSubmit = (e) => {
    e.preventDefault();


    // Only proceed if all fields are filled
    if (Object.values(formData).every((value) => value !== "")) {
      // action is dispatch to reducer and reducer updates the state
      const height = formData.height;
      const depth = formData.depth;
      const shelfCount = formData.shelfCount
      dispatch(setConfiguration({
        height: parseInt(formData.height),
        width: parseInt(formData.width),
        depth: parseInt(formData.depth),
        shelfCount: parseInt(formData.shelfCount),
      }));

      const positions =  GeneratePosArr(formData.height, shelfCount);
      const racksCount = findOptimizedRacks(formData.width);
       setPositionArr(positions);
       setRacks(racksCount);
       dispatch(setSection({racksCount,height,shelfDepth:depth,positions}));
     
    }
  };

  return (
    <>
    <img className="pointing-man" src={logo}/>
    <div className="configurator-container">
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="title">
          <h1>Build your shelving</h1>
        </div>
        <div className="form-fields">
          <FormInputField
              number="1"
              icon={faArrowsUpDown}
              label="Height"
              name="height"
              value={formData.height}
              options={options.height}
              onChange={handleChange}
            />

            <FormInputField
              number="2"
              icon={faArrowsLeftRight}
              label="Width"
              name="width"
              value={formData.width}
              options={options.width}
              onChange={handleChange}
            />

            <FormInputField
              number="3"
              icon={faArrowUpRightDots}
              label="Depth"
              name="depth"
              value={formData.depth}
              options={options.depth}
              onChange={handleChange}
            />

            <FormInputField
              number="4"
              icon={faLayerGroup}
              label="Shelves"
              name="shelfCount"
              value={formData.shelfCount}
              options={options.shelfCount}
              onChange={handleChange}
            />

        </div>
        <button type="submit" className="submit-button">
          Configure Shelving
        </button>
      </form>
    </div>
    </>
  );
};

export default ConfigurationFrom;
