import * as React from 'react';
import { useState } from 'react';
// eslint-disable-next-line import/no-webpack-loader-syntax
import ReactMapGL from 'react-map-gl';

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
      <ReactMapGL
          {...viewport}
          onViewportChange={(nextViewport: ViewPort) => setViewport(nextViewport)}
      />
  );
}

export default App;