import React from 'react';

import { useUrlParamsQuery } from '../../../common/hooks';

import CreateSimulationForm from './CreateSimulationForm';

export default function SimulationFormWrapper(): JSX.Element {
  const selectedMapId = useUrlParamsQuery().get('mapId');
  const parsedId = selectedMapId === null ? null : parseInt(selectedMapId);
  return (
    <div>
      {parsedId ? (
        <CreateSimulationForm mapId={parsedId} />
      ) : (
        <div>Sorry, no valid mapId found in querystring</div>
      )}
    </div>
  );
}
