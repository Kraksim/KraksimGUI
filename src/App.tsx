import * as React from 'react';
import { useState } from 'react';
import ReactMapGL from 'react-map-gl';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import SimulationPage from './features/simulation/components/SimulationPage';
import StatisticsPageWrapper from './features/simulation/statistics/StatisticsPageWrapper';

type ViewPort = {
  width: number;
  height: number;
  latitude: number;
  longitude: number;
  zoom: number;
};

function App(): JSX.Element {
  const [viewport, setViewport] = useState<ViewPort>({
    width: 1500,
    height: 1000,
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  });

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/simulations">
          <SimulationPage/>
        </Route>
        <Route path="/statistics">
          <StatisticsPageWrapper/>
        </Route>
        <Route path="/">
              <ReactMapGL
          {...viewport}
          onViewportChange={(nextViewport: ViewPort) => setViewport(nextViewport)}
        />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;