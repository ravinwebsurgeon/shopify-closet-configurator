"use client";
import "./ShelvingConfigurator.css";
import ConfigurationTab from "../ConfigurationTab/ConfigurationTab";
import ImageConfigurator from "../ImageConfigurator/ImageConfigurator";
import { useDispatch, useSelector } from "react-redux";
import {
  setAPIData,
  setConfiguration,
  setDefault,
  setSection,
} from "../../slices/shelfDetailSlice";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getPriceProductById } from "../../services/productService";

const ShelvingConfigurator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const metalShelfDetail = useSelector((state) => state.shelfDetail);
  const priceData = metalShelfDetail?.priceData;
  const searchParams = useSearchParams();
  const [data, setData] = useState(false);
  const prevData = searchParams.get("data");
  useEffect(() => {
    const term = searchParams.get("data");
    const width = parseInt(searchParams.get("width"));
    const height = parseInt(searchParams.get("height"));
    const depth = parseInt(searchParams.get("depth"));
    const shelfCount = parseInt(searchParams.get("shelfCount"));
    if (term) {
      const parsedData = JSON.parse(term);
      dispatch(setDefault(parsedData?.data));
      setData(true);
    }
    if (width && height && depth && shelfCount) {
      dispatch(
        setConfiguration({
          height: height,
          width: width,
          depth: depth,
          shelfCount: shelfCount,
        })
      );

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
        { 350: "182" },
      ];
      // function used to set shelves at a specific height
      const GeneratePosArr = (currShelfHeight, shelfCount) => {
        const Result = heightArr.find(
          (obj) => obj[currShelfHeight] !== undefined
        );
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
            if (
              !bestCombination ||
              combination.length < bestCombination.length
            ) {
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
      const positions = GeneratePosArr(height, shelfCount);
      const racksCount = findOptimizedRacks(width);

      dispatch(
        setSection({
          racksCount,
          currShelfHeight: height,
          shelfDepth: depth,
          positions,
        })
      );
      setData(true);
    }
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { rawData, structuredPricing } = await getPriceProductById(
          "15386352714077"
        );
        dispatch(setAPIData(structuredPricing));
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    if (!priceData) {
      fetchData();
    }
  }, []);
  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-md z-50 flex items-center justify-center">
          {/* <div className=" bg-white p-5 rounded-lg flex items-center gap-3"> */}
          <div className=" p-5 rounded-lg flex items-center gap-3">
            <div className="w-8 h-8 border-4 border-[#EB6200] border-t-transparent rounded-full animate-spin"></div>
            {/* <span className="text-lg font-inter">Loading...</span> */}
          </div>
        </div>
      )}
      {data && (
        <div className="configurator-main-container py-5 flex px-[25px] pl-[99px] max-dex-sm:p-5 max-tab-xl:flex-col">
          <div className="configurator-right-section flex-1">
            <ImageConfigurator />
          </div>
          <ConfigurationTab prevData={prevData || null} />
        </div>
      )}
    </>
  );
};

export default ShelvingConfigurator;
