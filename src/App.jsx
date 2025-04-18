import { useDispatch, useSelector } from "react-redux";
import ConfigurationFrom from "./components/ConfigrationForm/ConfigurationFrom";
import ShelvingConfigurator from "./components/ShelvingConfigurator/ShelvingConfigurator";
import "./index.css";
import "./App.css";
import { setOpenModal } from "./slices/shelfDetailSlice";
import Modal from "./components/Shared/Modal/Modal";
import { ToastContainer } from 'react-toastify';

function App() {
  const dispatch = useDispatch();
  const productInformation = useSelector((state) => state.shelfDetail.productInformation);
  const isModalOpen = useSelector((state) => state.shelfDetail.isModalOpen);
  const showConfigurator = useSelector(
    (state) => state.shelfDetail.showConfigurator
  );
  return (
    <>
      {!showConfigurator ? <ConfigurationFrom /> : <ShelvingConfigurator />}
      {isModalOpen && (
        <Modal
          isModalOpen={isModalOpen}
          productInformation={productInformation}
          closeModal={() => dispatch(setOpenModal(false))}
        />
      )}
      <ToastContainer/>
    </>
  );
}

export default App;
