import * as React from 'react';
import { useState } from 'react';
import ReactMapGL from 'react-map-gl';

function App() {
  const [viewport, setViewport] = useState({
    width: 1500,
    height: 1000,
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8
  });

  return (
      <ReactMapGL
          {...viewport}
          onViewportChange={nextViewport => setViewport(nextViewport)}
      />
  );
}

export default App