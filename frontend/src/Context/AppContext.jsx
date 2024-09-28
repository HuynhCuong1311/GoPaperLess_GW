import PropTypes from "prop-types";
import { createContext, useRef, useState } from "react";

export const AppContext = createContext({
  sigSelected: "",
  handleSigSelected: () => {},
  blink: false,
});

export const AppProvider = ({ children }) => {
  const [sigSelected, setSigSelected] = useState("");
  const [blink, setBlink] = useState(false);
  const timeoutRef = useRef(null);

  const handleSigSelected = (sigSelected) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setBlink(true);
    setSigSelected(sigSelected);
    timeoutRef.current = setTimeout(() => setBlink(false), 1000);
  };
  return (
    <AppContext.Provider value={{ sigSelected, handleSigSelected, blink }}>
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node,
};
