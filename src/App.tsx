import { Profiler, useRef, useState } from "react";
import PrivateRoute from "./auth_components/PrivateRoute";
import { isProfilerOn } from "./config/constants";
import privateRoutes from "./config/privateRoutes";
import publicRoutes from "./config/publicRoutes";
import { TopNav } from "./components/TopNav";
import { Footer } from "./components/Footer";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import AuthProvider from "./contexts/AuthContext";
import { AllBuildingsProvider } from "./contexts/AllBuildingsContext";
import { ModalContext, ModalState } from "./contexts/ModalContext";

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
              <div ref={topNavRef} className="topnav-container">
                <TopNav />
              </div>
              <AllBuildingsProvider>
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
