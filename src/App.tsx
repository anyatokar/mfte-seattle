import { Profiler, useState } from "react";
import PrivateRoute from "./auth_components/PrivateRoute";
import { isProfilerOn } from "./config/config";
import privateRoutes from "./config/privateRoutes";
import publicRoutes from "./config/publicRoutes";
import { Header } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import AuthProvider from "./contexts/AuthContext";
import { AllBuildingsProvider } from "./contexts/AllBuildingsContext";
import { ModalContext, ModalState } from "./contexts/ModalContext";

const Application: React.FC = () => {
  const modalStateHook = useState(ModalState.HIDDEN);

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
          <AllBuildingsProvider>
            <AuthProvider>
              <ModalContext.Provider value={modalStateHook}>
                <Header />
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
                      element={<route.component />}
                    />
                  ))}
                </Routes>
              </ModalContext.Provider>
            </AuthProvider>
          </AllBuildingsProvider>
          <Footer />
        </BrowserRouter>
      </div>
    </Profiler>
  );
};

export default Application;
