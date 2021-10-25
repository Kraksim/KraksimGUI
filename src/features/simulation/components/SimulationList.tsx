import React from 'react';

import { useGetAllSimulationsQuery } from '../simulationApi';

export default function SimulationList(): JSX.Element {
  const { data, isLoading } = useGetAllSimulationsQuery();

  return (
      <div>
        {isLoading ? 
        <div>Loading...</div> :
          (data && data.map(simulation => <div key={simulation.id}>{simulation.id}</div>))}
    </div>);
}