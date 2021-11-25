import React from 'react';

import { useUrlParamsQuery } from '../../common/hooks';

import CompareSimulationPage from './CompareSimulationsPage';

export default function CompareSimulationsPageWrapper(): JSX.Element{
  const queryParams = useUrlParamsQuery();
  const firstSimulationId = queryParams.get('firstSimulationId');
  const secondSimulationId = queryParams.get('secondSimulationId');

  return (
        <div>
            {(firstSimulationId && secondSimulationId) ? 
            <CompareSimulationPage
            firstSimulationId={parseInt(firstSimulationId)} 
            secondSimulationId={parseInt(secondSimulationId)}/> : 
            <div>firstSimulationId or secondSimulationId not in querystring :(</div>}
        </div>
  );
}