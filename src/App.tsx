import { useRef, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import config from "./config/config";
import privateRoutes from "./config/privateRoutes";
import publicRoutes from "./config/publicRoutes";
import PrivateRoute from "./components/auth/PrivateRoute";
import { TopNav } from "./components/navbars/TopNav";
import { Footer } from "./components/navbars/Footer";
import RenderProfiler from "./components/utility/RenderProfiler";
import AuthProvider from "./contexts/AuthContext";
import { ModalContext, ModalState } from "./contexts/ModalContext";

const Application: React.FC = () => {
  const modalStateHook = useState(ModalState.HIDDEN);
  const topNavRef = useRef<HTMLDivElement | null>(null);

  const composeProviders =
    (providers: React.ComponentType<{ children: React.ReactNode }>[]) =>
    (children: React.ReactNode) =>
      providers.reduceRight(
        (acc, Provider) => <Provider>{acc}</Provider>,
        children
      );

  return (
    <RenderProfiler id="Application" isProfilerOn={config.debug.isProfilerOn}>
      <div className="main">
        <BrowserRouter>
          <AuthProvider>
            <ModalContext.Provider value={modalStateHook}>
              <div ref={topNavRef}>
                <TopNav />
              </div>
              <Routes>
                {/* TODO: Can DRY this up. */}
                {privateRoutes.map(
                  ({
                    name,
                    path,
                    component: Component,
                    wrapWith = [],
                    props,
                  }) => {
                    const element = (
                      <Component {...(props || {})} topNavRef={topNavRef} />
                    );

                    const wrappedElement = wrapWith.length
                      ? composeProviders(wrapWith)(element)
                      : element;

                    const protectedElement = (
                      <PrivateRoute name={name}>{wrappedElement}</PrivateRoute>
                    );

                    return (
                      <Route
                        key={name}
                        path={path}
                        element={protectedElement}
                      />
                    );
                  }
                )}

                {publicRoutes.map(
                  ({
                    name,
                    path,
                    component: Component,
                    wrapWith = [],
                    props,
                  }) => {
                    const element = (
                      <Component {...(props || {})} topNavRef={topNavRef} />
                    );

                    const wrappedElement = wrapWith.length
                      ? composeProviders(wrapWith)(element)
                      : element;

                    return (
                      <Route key={name} path={path} element={wrappedElement} />
                    );
                  }
                )}
              </Routes>
            </ModalContext.Provider>
          </AuthProvider>
          <Footer />
        </BrowserRouter>
      </div>
    </RenderProfiler>
  );
};

export default Application;
