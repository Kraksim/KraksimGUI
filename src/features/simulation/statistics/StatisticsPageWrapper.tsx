import React from 'react';

import { useUrlParamsQuery } from '../../common/hooks';

import StatisticsPage from './StatisticsPage';

export default function StatisticsPageWrapper(): JSX.Element {
  const simulationId = useUrlParamsQuery().get('simulationId');

  return (
    <div>
      {simulationId ? (
        <StatisticsPage selectedSimulationId={parseInt(simulationId)} />
      ) : (
        <div>simulationId not in querystring :(</div>
      )}
    </div>
  );
}
