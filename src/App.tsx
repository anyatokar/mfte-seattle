import { Profiler, useRef, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./auth_components/PrivateRoute";
import { isProfilerOn } from "./config/constants";
import privateRoutes from "./config/privateRoutes";
import publicRoutes from "./config/publicRoutes";
import { TopNav } from "./components/TopNav";
import { Footer } from "./components/Footer";

import AuthProvider from "./contexts/AuthContext";
import { AllBuildingsProvider } from "./contexts/AllBuildingsContext";
import { HouseholdProvider } from "./contexts/HouseholdContext";
import { ModalContext, ModalState } from "./contexts/ModalContext";
import { TempBuildingsProvider } from "./contexts/TempBuildingsContext";

const Application: React.FC = () => {
  const modalStateHook = useState(ModalState.HIDDEN);
  const topNavRef = useRef<HTMLDivElement | null>(null);

  return (
    <Profiler
      id={"Application"}
      onRender={(
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime
      ) => {
        if (isProfilerOn) {
          console.log({
            id,
            phase,
            actualDuration,
            baseDuration,
            startTime,
            commitTime,
          });
        }
      }}
    >
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
    </Profiler>
  );
};

export default Application;
