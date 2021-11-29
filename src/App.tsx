import * as React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import HomePage from './features/page/home/HomePage';
import MapList from './features/page/map-list/MapList';
import SimulationList from './features/page/simulation-list/SimulationList';
import CreateSimulationPage from './features/simulation/components/CreateSimulationPage';
import CompareSimulationsPageWrapper from './features/simulation/statistics/CompareSimulationsPageWrapper';
import StatisticsPageWrapper from './features/simulation/statistics/StatisticsPageWrapper';
import CreateMapPage from './features/map/components/CreateMapPage';

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/simulations/all">
          <SimulationList />
        </Route>
        <Route path="/maps/all">
          <MapList />
        </Route>
        <Route path="/simulations/create">
          <CreateSimulationPage />
        </Route>
        <Route path="/simulations/compare">
          <CompareSimulationsPageWrapper />
        </Route>
        <Route path="/statistics">
          <StatisticsPageWrapper />
        </Route>
        <Route path="/maps/create">
          <CreateMapPage />
        </Route>
        <Route path="/">
          <HomePage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
