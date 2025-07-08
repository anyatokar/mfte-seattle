import { useRef, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/auth/PrivateRoute";
import config from "./config/config";
import privateRoutes from "./config/privateRoutes";
import publicRoutes from "./config/publicRoutes";

import RenderProfiler from "./components/utility/RenderProfiler";
import { TopNav } from "./components/navbars/TopNav";
import { Footer } from "./components/navbars/Footer";

import AuthProvider from "./contexts/AuthContext";
import { AllBuildingsProvider } from "./contexts/AllBuildingsContext";
import { HouseholdProvider } from "./contexts/HouseholdContext";
import { ModalContext, ModalState } from "./contexts/ModalContext";
import { TempBuildingsProvider } from "./contexts/TempBuildingsContext";

const Application: React.FC = () => {
  const modalStateHook = useState(ModalState.HIDDEN);
  const topNavRef = useRef<HTMLDivElement | null>(null);

  return (
    <RenderProfiler id="Application" isProfilerOn={config.debug.isProfilerOn}>
      <div className="main">
        <BrowserRouter>
          <AuthProvider>
            <ModalContext.Provider value={modalStateHook}>
              <div ref={topNavRef}>
                <TopNav />
              </div>
              <AllBuildingsProvider>
                <TempBuildingsProvider>
                  <HouseholdProvider>
                    <Routes>
                      {privateRoutes.map((route) => (
                        <Route
                          key={route.name}
                          path={route.path}
                          element={
                            <PrivateRoute name={route.name}>
                              <route.component />
                            </PrivateRoute>
                          }
                        />
                      ))}

                      {publicRoutes.map((route) => (
                        <Route
                          key={route.name}
                          path={route.path}
                          element={<route.component topNavRef={topNavRef} />}
                        />
                      ))}
                    </Routes>
                  </HouseholdProvider>
                </TempBuildingsProvider>
              </AllBuildingsProvider>
            </ModalContext.Provider>
          </AuthProvider>

          <Footer />
        </BrowserRouter>
      </div>
    </RenderProfiler>
  );
};

export default Application;
