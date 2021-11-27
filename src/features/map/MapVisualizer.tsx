import { Box } from '@mui/material';
import React, { useMemo } from 'react';
import Graph from 'react-graph-vis';

import { BasicMapInfo } from './types';

const NODE_SIZE = 50;
const DISTANCE_MULTIPLIER = 7;


interface Props {
  map: BasicMapInfo;
}

interface GraphData {
  nodes: Array<{ id: number, label: string, color: string, x: number, y: number, size: number }>,
  edges: Array<{ from: number, to: number, value: number }>
}

function createGraph(map: BasicMapInfo): GraphData {
  const nodes = map.nodes
    .map(({
      id, name, type, position,
    }) => (
      {
        id,
        label: name,
        color: type === 'INTERSECTION' ? '#e04141' : '#e09c41',
        x: position.x * DISTANCE_MULTIPLIER,
        y: position.y * DISTANCE_MULTIPLIER,
        size: NODE_SIZE,
      }));

  const edges = map.edges.map(({ from, to, roadThickness }) => (
    {
      from: from,
      to: to,
      value: roadThickness,
    }));


  return { nodes, edges };
}

export default function MapVisualizer({ map }: Props): JSX.Element {
  const memoizedCreateGraph = useMemo(() => createGraph(map), [map]);
  return (
    <Box height="100%" width="100%">
        <Graph
            graph={memoizedCreateGraph}
            options={
                {
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
        />
    </Box>
  );
}