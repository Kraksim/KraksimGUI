import { Box } from '@mui/material';
import React from 'react';
import Graph from 'react-graph-vis';

import { RoadNode, SimulationMap } from './types';

const NODE_SIZE = 50;
const DISTANCE_MULTIPLIER = 7;


interface Props {
  map: SimulationMap;
}

interface GraphData {
  nodes: Array<{ id: number, label: string, color: string, x: number, y: number, size: number }>,
  edges: Array<{ from: number, to: number, value: number }>
}

function createGraph(map: SimulationMap): GraphData {
  const nodes = map.roadNodes
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

  const fromMap = new Map<number, RoadNode>();
  const toMap = new Map<number, RoadNode>();
    
  map.roadNodes.forEach(node => {
    node.endingRoads.forEach(({ id }) => {
      toMap.set(id, node);
    });

    node.startingRoads.forEach(({ id }) => {
      fromMap.set(id, node);
    });
  });

  const edges = map.roads.map(({ id, lanes }) => 
    ({ 
      from: fromMap.get(id)!.id, 
      to: toMap.get(id)!.id, 
      value:  lanes.length,
    }));

  return { nodes, edges };
}

export default function MapVisualizer({ map }: Props): JSX.Element{
  return (
      <Box height="100vh" width="100vh">
        <Graph 
            graph={createGraph(map)} 
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