import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "./ImageConfigurator.css";

const ImageConfigurator = () => {
  const intialShelfValue = useSelector(
    (state) => state.shelfDetail.configuration
  );

  return (
    <>
      <div className="visualFrame_container ConfiguratorEditView_visualFrame__5OS3U">
        <div className="row-container visualFrame-top">
          <div className="spacer-div"></div>
          <div className="addsection-div">
            <button className="AddSection"> + Add Section</button>
          </div>
          <div className="hidedoors-div">Hide doors</div>
        </div>
        <div className="demo-config">
          <div className="Visual_container__tG7BQ Carousel_visual__FfW0p">
            {/* first two poles section */}
            <div
              className="Staander_Staander__rAo9j Visual_animating__a8ZaU Staander_height100__eNZxD Staander_metal__vQ0lt Staander_hasTopdoppen__ZdnQY Staander_voetPlastic__WSqGI"
              style={{ zIndex: 0 }}
            >
              <div className="Staander_achter__8cpuX">
                <div className="Staander_achterTop__nQ0aW"></div>
                <div className="Staander_achterMiddle__XrxPJ"></div>
                <div className="Staander_achterBottom__YRp6n"></div>
              </div>
              <div className="Staander_voor__AegR3">
                <div className="Staander_voorTop__1m0QA"></div>
                <div className="Staander_voorMiddle__O-Po9"></div>
                <div className="Staander_voorBottom__dVzsj"></div>
              </div>
            </div>

            {/* shelf section */}
            <div>
              <div
                data-indicator-index="1"
                className="Section_Section__3MCIu Visual_animating__a8ZaU Section_width85__HyRzH Section_height100__Nz9yH Section_metal__cphN6"
                style={{ zIndex: 1 }}
              >
                <div className="Section_accessoires__+se2+">
                  <button
                    className="Legbord_Legbord__k51II Section_legbord__n3SHS Legbord_metal__66pLU Legbord_clickable__uTn2b"
                    style={{ zIndex: 3, top: "0em" }}
                  >
                    <div className="Legbord_inner__eOg0b">
                      <div className="Legbord_left__ERgV5"></div>
                      <div className="Legbord_middle__D8U0x"></div>
                      <div className="Legbord_right__HB8+U"></div>
                    </div>
                  </button>
                  <button
                    className="Legbord_Legbord__k51II Section_legbord__n3SHS Legbord_metal__66pLU Legbord_clickable__uTn2b"
                    style={{ zIndex: 2, top: "23.75em" }}
                  >
                    <div className="Legbord_inner__eOg0b">
                      <div className="Legbord_left__ERgV5"></div>
                      <div className="Legbord_middle__D8U0x"></div>
                      <div className="Legbord_right__HB8+U"></div>
                    </div>
                  </button>
                  <button
                    className="Legbord_Legbord__k51II Section_legbord__n3SHS Legbord_metal__66pLU Legbord_clickable__uTn2b"
                    style={{ zIndex: 1, top: "47.5em" }}
                  >
                    <div className="Legbord_inner__eOg0b">
                      <div className="Legbord_left__ERgV5"></div>
                      <div className="Legbord_middle__D8U0x"></div>
                      <div className="Legbord_right__HB8+U"></div>
                    </div>
                  </button>
                </div>
                {/* Here section header div will come */}
              </div>
            </div>
            {/* next two poles */}
            <div
              className="Staander_Staander__rAo9j Visual_animating__a8ZaU Staander_notFirst__FSKKl Staander_height100__eNZxD Staander_metal__vQ0lt Staander_hasTopdoppen__ZdnQY Staander_voetPlastic__WSqGI"
              style={{zIndex: 2}}
            >
              <div className="Staander_achter__8cpuX">
                <div className="Staander_achterTop__nQ0aW"></div>
                <div className="Staander_achterMiddle__XrxPJ"></div>
                <div className="Staander_achterBottom__YRp6n"></div>
              </div>
              <div className="Staander_voor__AegR3">
                <div className="Staander_voorTop__1m0QA"></div>
                <div className="Staander_voorMiddle__O-Po9"></div>
                <div className="Staander_voorBottom__dVzsj"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageConfigurator;
