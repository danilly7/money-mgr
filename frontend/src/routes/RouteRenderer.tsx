import React from 'react';
import { Route, Routes, RouteObject } from 'react-router-dom';

interface RouteRendererProps {
    routes: RouteObject[];
};

const RouteRenderer: React.FC<RouteRendererProps> = ({ routes }) => {
    return (
        <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element}>
            {route.children &&
              route.children.map((childRoute, childIndex) => (
                <Route
                  key={childIndex}
                  path={childRoute.path}
                  element={childRoute.element}
                />
              ))}
          </Route>
        ))}
      </Routes>
    );
};

export default RouteRenderer;