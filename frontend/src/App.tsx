import React, { Suspense } from 'react';
import Spinner from "./components/ui/spinner";

//Aquí pues los comp ui que tenga.

import { routes } from './routes';
import RouteRenderer from './routes/RouteRenderer';
import { RouteObject } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <>
      {/* Header por ejemplo */}

      <div className="bg-slate-200 flex flex-col min-h-screen">
        <Suspense fallback={<Spinner />}>
          <RouteRenderer routes={routes as RouteObject[]} />
        </Suspense>
      </div>

      {/* Footer
      Buttons de scroll */}
    </>
  )
};

export default App;
