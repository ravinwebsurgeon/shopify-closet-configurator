import { useDispatch, useSelector } from "react-redux";
import ConfigurationFrom from "./components/ConfigrationForm/ConfigurationFrom";
import ShelvingConfigurator from "./components/ShelvingConfigurator/ShelvingConfigurator";
import "./index.css";
import "./App.css";
import { setOpenModal, setSidewallSelected } from "./slices/shelfDetailSlice";
import Modal from "./components/Shared/Modal/Modal";
import { ToastContainer } from 'react-toastify';
import AddSide from "./components/ModalChildComponents/AddSideComponent/AddSide";

function App() {
  const dispatch = useDispatch();
  const productInformation = useSelector((state) => state.shelfDetail.productInformation);
  const isModalOpen = useSelector((state) => state.shelfDetail.isModalOpen);
  const showConfigurator = useSelector(
    (state) => state.shelfDetail.showConfigurator
  );
  const sidewallSide = useSelector((state)=>state.shelfDetail.sidewallSelected);

  const handleModalClose = () =>{
    dispatch(setOpenModal(false));
    if(sidewallSide != ""){
      dispatch(setSidewallSelected(""));
    }
  };

  return (
    <>
      
      {!showConfigurator ? <ConfigurationFrom /> : <ShelvingConfigurator />}
      {isModalOpen && (
        <Modal
          isModalOpen={isModalOpen}
          productInformation={productInformation}
          closeModal={handleModalClose}  
        >
          {sidewallSide != "" ?<AddSide side={sidewallSide}/>: null}
        </Modal>
      )}
      <ToastContainer/>
    </>
  );
}

export default App;
