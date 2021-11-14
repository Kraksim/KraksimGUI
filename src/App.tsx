import * as React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import HomePage from './features/page/home/HomePage';
import SimulationList from './features/page/simulation-list/SimulationList';
import SimulationPage from './features/simulation/components/SimulationPage';
import CompareSimulationsPageWrapper from './features/simulation/statistics/CompareSimulationsPageWrapper';
import StatisticsPageWrapper from './features/simulation/statistics/StatisticsPageWrapper';


function App(): JSX.Element {

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/simulations/all">
          <SimulationList />
        </Route>
        <Route path="/simulations/create">
          <SimulationPage/>
        </Route>
        <Route path="/simulations/compare">
          <CompareSimulationsPageWrapper/>
        </Route>
        <Route path="/statistics">
          <StatisticsPageWrapper/>
        </Route>
        <Route path="/">
          <HomePage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;