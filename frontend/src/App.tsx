import React, { Suspense } from 'react';
import Spinner from "./components/ui/spinner";

import { routes } from './routes';
import RouteRenderer from './routes/RouteRenderer';
import { RouteObject } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <>
      <div className="min-h-screen bg-slate-200 flex flex-col">
        <Suspense fallback={<Spinner />}>
          <RouteRenderer routes={routes as RouteObject[]} />
        </Suspense>
      </div>
    </>
  )
};

export default App;