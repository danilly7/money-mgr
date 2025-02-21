import React, {Suspense} from 'react';
import { Route, Routes, RouteObject } from 'react-router-dom';
import Spinner from '../components/ui/spinner';

interface RouteRendererProps {
  routes: RouteObject[];
};

const RouteRenderer: React.FC<RouteRendererProps> = ({ routes }) => {
  const renderRoutes = (routes: RouteObject[], parentPath = '') => {
    return routes.map((route, index) => {
      //si la ruta tiene hijos y nietos, renderizamos el elemento de la ruta padre, hijas y nietos
      const fullPath = route.path ? `${parentPath}/${route.path}`.replace(/\/+/g, '/') : parentPath;

      if (route.children) {
        return (
          <Route
            key={index}
            path={fullPath}
            element={<Suspense fallback={<Spinner />}>{route.element}</Suspense>}
          >
             {renderRoutes(route.children, fullPath)}
          </Route>
        );
      }

      //si la ruta no tiene hijos, se renderiza normal
      return (
        <Route
          key={index}
          path={fullPath}
          element={<Suspense fallback={<Spinner />}>{route.element}</Suspense>}
        />
      );
    });
  };

  return <Routes>{renderRoutes(routes)}</Routes>;
};

export default RouteRenderer;