import React from "react";
import {
  Card, Typography, Switch, IconButton, Button,
} from "@material-tailwind/react";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setSidenavType,
  setSidenavColor,
  setFixedNavbar,
  setTransparentNavbar,
} from "../../context/index";

const COLOR_SWATCHES = ["dark", "blue", "green", "red", "white"];

export default function Configurator() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { openConfigurator, sidenavType, sidenavColor, fixedNavbar, transparentNavbar } = controller;

  return (
    <>
      {/* Floating gear */}
      <IconButton
        size="lg"
        className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg"
        onClick={() => setOpenConfigurator(dispatch, true)}
        aria-label="open-configurator"
        title="Configurator"
      >
        ⚙️
      </IconButton>

      {/* Panel */}
      <div
        className={[
          "fixed top-0 right-0 z-50 h-screen w-96 bg-white shadow-lg transition-transform duration-300",
          openConfigurator ? "translate-x-0" : "translate-x-[420px]",
        ].join(" ")}
      >
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <Typography variant="h5">Dashboard Configurator</Typography>
            <Typography variant="small" color="gray">Tune the shell to your taste.</Typography>
          </div>
          <IconButton variant="text" onClick={() => setOpenConfigurator(dispatch, false)} aria-label="close">
            ✖
          </IconButton>
        </div>

        <div className="p-6 space-y-8 overflow-y-auto h-[calc(100vh-72px)]">
          {/* Sidenav colors */}
          <section>
            <Typography variant="h6">Sidenav Color</Typography>
            <div className="mt-3 flex gap-2">
              {COLOR_SWATCHES.map((c) => (
                <button
                  key={c}
                  onClick={() => setSidenavColor(dispatch, c)}
                  className={[
                    "h-7 w-7 rounded-full border transition-transform hover:scale-105",
                    c === "dark" ? "bg-gray-900" :
                    c === "blue" ? "bg-blue-600" :
                    c === "green" ? "bg-green-600" :
                    c === "red" ? "bg-red-600" :
                    "bg-gray-100",
                    sidenavColor === c ? "ring-2 ring-offset-2 ring-gray-900" : "",
                  ].join(" ")}
                  aria-label={`color-${c}`}
                  title={c}
                />
              ))}
            </div>
          </section>

          {/* Sidenav type */}
          <section>
            <Typography variant="h6">Sidenav Type</Typography>
            <div className="mt-3 flex gap-2">
              {["dark", "transparent", "white"].map((t) => (
                <Button
                  key={t}
                  variant={sidenavType === t ? "filled" : "outlined"}
                  onClick={() => setSidenavType(dispatch, t)}
                >
                  {t}
                </Button>
              ))}
            </div>
          </section>

          {/* Navbar settings */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <Typography className="font-medium">Fixed Navbar</Typography>
              <Switch checked={fixedNavbar} onChange={(e) => setFixedNavbar(dispatch, e.target.checked)} />
            </div>
            <div className="flex items-center justify-between">
              <Typography className="font-medium">Transparent Navbar</Typography>
              <Switch checked={transparentNavbar} onChange={(e) => setTransparentNavbar(dispatch, e.target.checked)} />
            </div>
          </section>

          <div className="pt-2">
            <Button onClick={() => setOpenConfigurator(dispatch, false)} fullWidth>
              Close
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
