import React from 'react';
import { Route, Routes, RouteObject } from 'react-router-dom';

interface RouteRendererProps {
  routes: RouteObject[];
};

const RouteRenderer: React.FC<RouteRendererProps> = ({ routes }) => {
  const renderRoutes = (routes: RouteObject[]) => {
    return routes.map((route, index) => {
      //si la ruta tiene hijos, renderizamos el `element` de la ruta padre y las rutas hijas
      if (route.children) {
        return (
          <Route
            key={index}
            path={route.path}
            element={route.element} //elemento padre
          >
            {renderRoutes(route.children)} {/* rutas hijas */}
          </Route>
        );
      }

      //si la ruta no tiene hijos, se renderiza normal
      return (
        <Route
          key={index}
          path={route.path}
          element={route.element}
        />
      );
    });
  };

  return <Routes>{renderRoutes(routes)}</Routes>;
};

export default RouteRenderer;