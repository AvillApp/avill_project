import Localization from "./Localization";
import React, { useState } from "react";
import Navigation from "./config/Navigation";

export default () => {
  const [conce, setConce] = useState(false);

  const Permiso = (id) => {
    setConce(id);
  };
  return <>{conce ? <Navigation /> : <Localization Permiso={Permiso} />}</>;
};
