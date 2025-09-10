import { ColorModeContext } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import


import { useMode } from "./theme";
import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";





function App() {

  const [theme, colorMode] = useMode();
  return(

    <ColorModeContext.Provider value={colorMode}>
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <div className="app">  
      <main className="content"></main>
      <Topbar/>
    </div>
    </ThemeProvider>
    </ColorModeContext.Provider>
  
  );
}

export default App;
