"use client";
import AddSide from "@/components/ModalChildComponents/AddSideComponent/AddSide";
import SectionDelete from "@/components/SectionDeleteComponent/SectionDelete";
import Modal from "@/components/Shared/Modal/Modal";
import {
  openDeleteModal,
  setOpenModal,
  setSidewallSelected,
} from "@/slices/shelfDetailSlice";

import { useDispatch, useSelector } from "react-redux";

const ReduxWrapper = () => {
  const dispatch = useDispatch();

  const productInformation = useSelector(
    (state) => state.shelfDetail.productInformation
  );
  const isModalOpen = useSelector((state) => state.shelfDetail.isModalOpen);
  const sidewallSide = useSelector(
    (state) => state.shelfDetail.sidewallSelected
  );
  const deleteModal = useSelector(
    (state) => state.shelfDetail.isDeleteModalOpen
  );

  const handleModalClose = () => {
    dispatch(setOpenModal(false));
    if (sidewallSide != "") {
      dispatch(setSidewallSelected(""));
    } else if (deleteModal) {
      dispatch(openDeleteModal(false));
    }
  };
  return (
    <div>
      {isModalOpen && (
        <Modal
          isModalOpen={isModalOpen}
          productInformation={productInformation}
          closeModal={handleModalClose}
          mainHeading={
            sidewallSide != ""
              ? "Wil je doorgaan met deze wijziging?"
              : deleteModal
              ? "deleteModal"
              : ""
          }
        >
          {sidewallSide != "" ? (
            <AddSide onClose={handleModalClose} side={sidewallSide} />
          ) : null}
          {deleteModal ? <SectionDelete onClose={handleModalClose} /> : null}
        </Modal>
      )}
    </div>
  );
};

export default ReduxWrapper;
