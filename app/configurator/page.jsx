import ShelvingConfigurator from "../../components/ShelvingConfigurator/ShelvingConfigurator";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense>
      {" "}
      <ShelvingConfigurator />
    </Suspense>
  );
};

export default page;
