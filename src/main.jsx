
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";                              // tailwind directives
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

import { ThemeProvider as MUIThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { ThemeProvider as MTProvider } from "@material-tailwind/react";
import { MaterialTailwindControllerProvider } from "./components/context/index"; // see step 
import { AuthProvider } from "./components/context/AuthContext.jsx";

const muiTheme = createTheme({
  palette: { mode: "light" }, // tweak later if you want dark
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <MUIThemeProvider theme={muiTheme}>
        <CssBaseline />
        <MTProvider>
          <MaterialTailwindControllerProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </MaterialTailwindControllerProvider>
        </MTProvider>
      </MUIThemeProvider>
    </BrowserRouter>
  </StrictMode>
);



// import "./index.css"
// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import { BrowserRouter } from 'react-router-dom'
// import App from './App.jsx'
// import { AuthProvider } from './context/AuthContext.jsx'
// import { ThemeProvider } from "@material-tailwind/react";

// const root = createRoot(document.getElementById("root"))

// root.render(
//   <StrictMode>
//     <BrowserRouter>
//       <AuthProvider>
//         <ThemeProvider>
//           <App />
//         </ThemeProvider>
//       </AuthProvider>
//     </BrowserRouter>
//   </StrictMode>
// )