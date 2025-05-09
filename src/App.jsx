import { useDispatch, useSelector } from "react-redux";
import ConfigurationFrom from "./components/ConfigrationForm/ConfigurationFrom";
import ShelvingConfigurator from "./components/ShelvingConfigurator/ShelvingConfigurator";
import "./index.css";
import "./App.css";
import { openDeleteModal, setOpenModal, setSidewallSelected } from "./slices/shelfDetailSlice";
import Modal from "./components/Shared/Modal/Modal";
import { ToastContainer } from 'react-toastify';
import AddSide from "./components/ModalChildComponents/AddSideComponent/AddSide";
import { BrowserRouter, Route, Router, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import SectionDelete from "./components/SectionDeleteComponent/SectionDelete";

function App() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productInformation = useSelector((state) => state.shelfDetail.productInformation);
  const isModalOpen = useSelector((state) => state.shelfDetail.isModalOpen);
  const showConfigurator = useSelector(
    (state) => state.shelfDetail.showConfigurator
  );
  const sidewallSide = useSelector((state)=>state.shelfDetail.sidewallSelected);
  const deleteModal = useSelector((state)=>state.shelfDetail.isDeleteModalOpen);

  const handleModalClose = () =>{
    dispatch(setOpenModal(false));
    if(sidewallSide != ""){
      dispatch(setSidewallSelected(""));
    }
    else if(deleteModal){
      dispatch(openDeleteModal(false));
    }
  };

  // const navigationEntries = performance.getEntriesByType("navigation");
  // useEffect(()=>{
  //   if(navigationEntries.length > 0 && navigationEntries[0].type === "reload"){
  //     alert('navigating to home page due to refresh/reload')
  //     navigate('/', { replace: true })
  //   }
  // },[navigate])

  return (
    <>
      {/* {!showConfigurator ? <ConfigurationFrom /> : <ShelvingConfigurator />} */}
        <Routes>
          <Route path="/" element={<ConfigurationFrom/>}/>
          <Route path="/configurator" element={<ShelvingConfigurator/>}/>
          <Route path="*" element={<ConfigurationFrom/>}/>
        </Routes>
      {isModalOpen && (
        <Modal
          isModalOpen={isModalOpen}
          productInformation={productInformation}
          closeModal={handleModalClose} 
          mainHeading={sidewallSide != "" ? "Wil je doorgaan met deze wijziging?" : deleteModal ? "deleteModal" : ""} 
        >
          {sidewallSide != "" ?<AddSide  onClose={handleModalClose} side={sidewallSide}/>: null}
          {deleteModal ? <SectionDelete onClose={handleModalClose}/>:null}
        </Modal>
      )}
      <ToastContainer/>
    </>
  );
}

export default App;
