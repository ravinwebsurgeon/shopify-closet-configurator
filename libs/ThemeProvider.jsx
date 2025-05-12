"use client";
import ReduxWrapper from "@/components/Global/ReduxWrapper";
import { store } from "@/store/store";
import React from "react";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

const ThemeProvider = ({ children }) => {
  return (
    <Provider store={store}>
      {children}
      <ReduxWrapper />
      <ToastContainer />
    </Provider>
  );
};

export default ThemeProvider;
