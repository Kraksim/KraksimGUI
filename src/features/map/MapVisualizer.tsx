import { Box } from '@mui/material';
import React, { useState } from 'react';

import { BasicMapInfo, Position, SetMapStateLambdaType } from './types';
import VisGraph, { GraphData, Node } from './VisGraph';

const NODE_SIZE = 50;
export const DISTANCE_MULTIPLIER = 7;

interface Props {
  map: BasicMapInfo;
  interactable?: boolean;
  createSelectHandler?: (mapState: GraphData, setMapState: SetMapStateLambdaType) => ((
    event: any,
  ) => void);
  createDoubleClickHandler?: (setMapState: SetMapStateLambdaType) => ((event: any,)=>void)  ;
  createNodeMovedHandler?:(mapState: GraphData)=> ((event: any,) => void);
  createNodeDeselectedHandler?: () => (()=> void);
}

export function createNode(
  id: number,
  name: string,
  type: 'INTERSECTION' | 'GATEWAY',
  position: Position,
): Node {
  return {
    id,
    label: name,
    color: type === 'INTERSECTION' ? '#e04141' : '#e09c41',
    x: position.x * DISTANCE_MULTIPLIER,
    y: position.y * DISTANCE_MULTIPLIER,
    size: NODE_SIZE,
  };
}

function createGraph(map: BasicMapInfo): GraphData {
  const nodes = map.nodes.map(({ id, name, type, position }) =>
    createNode(id, name, type, position),
  );

  const edges = map.edges.map(({ from, to, roadThickness }) => ({
    from: from,
    to: to,
    value: roadThickness,
  }));

  return { nodes, edges };
}

function getStaticMapOptions() {
  return {
    interaction: {
      dragNodes: false,
      dragView: false,
      selectable: false,
      zoomView: false,
      hover: false,
    },
  };
}

export default function MapVisualizer({
  map,
  interactable = false,
  createSelectHandler,
  createDoubleClickHandler,
  createNodeMovedHandler,
  createNodeDeselectedHandler,
}: Props): JSX.Element {
  const [mapState, setMapState] = useState(createGraph(map));
  const additionalOptions = interactable ? {} : getStaticMapOptions();

  const selectHandler = createSelectHandler?.call( undefined, mapState, setMapState);
  const doubleClickHandler = createDoubleClickHandler?.call(undefined, setMapState);
  const dragEndHandler = createNodeMovedHandler?.call(undefined, mapState);
  const deselectNodeHandler = createNodeDeselectedHandler?.call(undefined);

  return (
    <Box height="100%" width="100%">
        <VisGraph
            graph={mapState}
            options={{
              ...additionalOptions,
              nodes: {
                shape: 'dot',
                scaling: {
                  min: 40,
                  max: 50,
                },
              },
              physics: {
                enabled: false,
              },
              edges: {
                arrows: {
                  to: { enabled: false },
                  from: { enabled: false },
                  middle: { enabled: true },
                },
                arrowStrikethrough: true,
                smooth: {
                  enabled: true,
                  type: 'curvedCCW',
                  roundness: 0.1,
                },
                scaling: {
                  min: 1,
                  max: 10,
                },
              },
            }}
            events={{
              select: selectHandler,
              doubleClick: doubleClickHandler,
              dragEnd: dragEndHandler,
              deselectNode: deselectNodeHandler,
            }}
        />
    </Box>
  );
}
