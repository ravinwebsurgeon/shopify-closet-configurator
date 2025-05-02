import React, { useEffect, useState } from "react";
import {
  faArrowsLeftRight,
  faArrowsUpDown,
  faArrowUpRightDots,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import "./ConfiguraionForm.css";
import FormInputField from "./FormInputField";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../assets/pointing.png";
import { setAPIData, setConfiguration, setSection } from "../../slices/shelfDetailSlice";
import axios from "axios";

const ConfigurationFrom = () => {
  const dispatch = useDispatch();
  const options = useSelector((state) => state.shelfDetail.options);
  const [apiData,setApiData] = useState(null);
  const [formData, setFormData] = useState({
    height: "",
    width: "",
    depth: "",
    shelfCount: "",
  });

  const heightArr = [
    { 100: "57" },
    { 120: "67" },
    { 150: "82" },
    { 180: "97" },
    { 200: "107" },
    { 210: "112" },
    { 220: "117" },
    { 240: "127" },
    { 250: "132" },
    { 300: "157" },
    { 350: "182" }
  ];

  const [positionArr, setPositionArr] = useState([]);
  const [racks, setRacks] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // function used to set shelves at a specific height
  const GeneratePosArr = (currShelfHeight, shelfCount) => {
    const Result = heightArr.find((obj) => obj[currShelfHeight] !== undefined);
    const heightResult = parseInt(Object.values(Result)[0]);

    const positions = [];

    for (let i = 0; i < shelfCount; i++) {
      const topPosition = ((heightResult - 9.5) / (shelfCount - 1)) * i;
      positions.push({
        zIndex: shelfCount - i,
        top: `${topPosition}em`,
      });
    }
    return positions;
  };

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

    if (Number(totalWidth) === 230) return [115, 115];

    return bestCombination || [];
  };

  const handleSubmit = () => {
    // Only proceed if all fields are filled
    if (Object.values(formData).every((value) => value !== "")) {
      // action is dispatch to reducer and reducer updates the state
      const height = formData.height;
      const depth = formData.depth;
      const shelfCount = formData.shelfCount;
      dispatch(
        setConfiguration({
          height: parseInt(formData.height),
          width: parseInt(formData.width),
          depth: parseInt(formData.depth),
          shelfCount: parseInt(formData.shelfCount),
        })
      );

      const positions = GeneratePosArr(formData.height, shelfCount);
      const racksCount = findOptimizedRacks(formData.width);
      setPositionArr(positions);
      setRacks(racksCount);
      dispatch(
        setSection({
          racksCount,
          currShelfHeight: height,
          shelfDepth: depth,
          positions,
        })
      );
    }
  };

  // used to fetch the pricing data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://shopify-closet-configurator-backend.vercel.app/api/products/8069243011259');
        setApiData(response.data);

        const metafields = response.data.metafields;

        const structuredPricing = {
          shelves: metafields.find(field => field.key === "shelves_pricing")?.value || {},
          poles: metafields.find(field => field.key === "poles")?.value || {},
          sidewall: {
            perfo: metafields.find(field => field.key === "sidewall_perfo")?.value || {},
            closed: metafields.find(field => field.key === "sidewall_closed")?.value || {}
          },
          compartment:{
            sliding_partition: metafields.find(field => field.key === "compartment_sliding_partition_pricing")?.value || {},
            compartment_divider_set: metafields.find(field => field.key === "compartment_divider_set")?.value || {}
          },
          braces:{
            "x-brace": metafields.find(field => field.key === "braces_x_braces_pricing")?.value || {},
            "h-brace": metafields.find(field => field.key === "braces_h_braces_pricing")?.value || {}
          },
          wardrobe_rod: metafields.find(field => field.key === "wardrobe_rod")?.value || {},
          topCaps: metafields.find(field => field.key === "topcap_plastic_")?.value || {},
          foot:metafields.find(field => field.key === "foot_plastic_pricing")?.value || {},
        };
        dispatch(setAPIData(structuredPricing));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
   
  }, []);



  useEffect(() => {
    if (
      formData.height &&
      formData.width &&
      formData.depth &&
      formData.shelfCount
    ) {
      handleSubmit();
    }
  }, [formData]);
  return (
    <>
      <div className="bg-[#FAFAFA] pt-[38px] pb-[37px] pl-[25px] pr-[99px]">
        <div className="flex justify-between items-center max-w-[1512px] mx-auto">
          <div className="flex items-center gap-5">
            <div>
              <img src="/shared/stand.png" width={276} />
            </div>
            <div>
              <h2 className="text-black max-w-[499px] font-inter text-[46px] leading-none tracking-[-2%] font-bold">
                Stel je eigen legbordstelling samen!
              </h2>
              <p className="text-black font-inter max-w-[420px] text-base leading-[150%] tracking-[-2%] font-normal mt-[27px]">
                Stel je eigen legbordstelling samen via onze handige
                configurator!
              </p>
            </div>
          </div>
          <div className="max-w-[499px] w-full bg-white rounded-[10px] border border-[rgba(0,0,0,0.1)]">
            <form
              className="form-card px-[30px] pt-[30px] pb-[39px]"
              onSubmit={handleSubmit}
            >
              <div className="form-fields flex flex-col gap-[15px]">
                <FormInputField
                  number="1"
                  icon={faArrowsUpDown}
                  label="Hoogte"
                  name="height"
                  value={formData.height}
                  options={options.height}
                  onChange={handleChange}
                  active={true}
                />

                <FormInputField
                  number="2"
                  icon={faArrowsLeftRight}
                  label="Breedte"
                  name="width"
                  value={formData.width}
                  options={options.width}
                  onChange={handleChange}
                  active={formData.height ? true : false}
                />

                <FormInputField
                  number="3"
                  icon={faArrowUpRightDots}
                  label="Diepte"
                  name="depth"
                  value={formData.depth}
                  options={options.depth}
                  onChange={handleChange}
                  active={formData.height && formData.width ? true : false}
                />

                <FormInputField
                  number="4"
                  icon={faLayerGroup}
                  label="Legborden"
                  name="shelfCount"
                  value={formData.shelfCount}
                  options={options.shelfCount}
                  onChange={handleChange}
                  active={
                    formData.height && formData.width && formData.depth
                      ? true
                      : false
                  }
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfigurationFrom;
