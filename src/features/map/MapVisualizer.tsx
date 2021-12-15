import { Box } from '@mui/material';
import React from 'react';

import { BasicMapInfo, Position, RoadNodeType } from './types';
import VisGraph, { GraphData, Node } from './VisGraph';

const NODE_SIZE = 50;
export const DISTANCE_MULTIPLIER = 7;
const INTERSECTION_COLOR = '#e04141';
const GATEWAY_COLOR = '#e09c41';

interface MapProps {
  map: BasicMapInfo;
  interactable?: boolean;
  createSelectHandler?: (mapState: GraphData) => ((
    event: any,
  ) => void);
  createDoubleClickHandler?: () => ((event: any,)=>void);
  createNodeMovedHandler?:(mapState: GraphData)=> ((event: any,) => void);
  createNodeDeselectedHandler?: () => () => void;
  createEdgeDeselectedHandler?: () => () => void;
  createEdgeSelectHandler?: (mapState: GraphData) => (event: any) => void;
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
    color: type === 'INTERSECTION' ? INTERSECTION_COLOR : GATEWAY_COLOR,
    x: position.x * DISTANCE_MULTIPLIER,
    y: position.y * DISTANCE_MULTIPLIER,
    size: NODE_SIZE,
  };
}

export function getNodeType(node: Node): RoadNodeType {
  return node.color === INTERSECTION_COLOR ? 'INTERSECTION' : 'GATEWAY';
}

function createGraph(map: BasicMapInfo): GraphData {
  const nodes = map.nodes.map(({ id, name, type, position }) =>
    createNode(id, name, type, position),
  );

  const edges = map.edges.map(({
    from, to, roadThickness, id, name,
  }) => ({
    from: from,
    to: to,
    value: roadThickness,
    id: id,
    label: name,
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

function getDynamicMapOptions(){
  return {
    interaction: {
      selectConnectedEdges: false,
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
  createEdgeSelectHandler,
  createEdgeDeselectedHandler,
}: MapProps): JSX.Element {
  const mapState = createGraph(map);
  const additionalOptions = interactable ? getDynamicMapOptions() : getStaticMapOptions();

  const selectHandler = createSelectHandler?.(mapState);
  const doubleClickHandler = createDoubleClickHandler?.();
  const dragEndHandler = createNodeMovedHandler?.(mapState);
  const deselectNodeHandler = createNodeDeselectedHandler?.();
  const selectEdgeHandler = createEdgeSelectHandler?.(mapState);
  const deselectEdgeHandler = createEdgeDeselectedHandler?.();

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
                  to: { enabled: true },
                  from: { enabled: false },
                  middle: { enabled: false },
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
              selectNode: selectHandler,
              doubleClick: doubleClickHandler,
              dragEnd: dragEndHandler,
              deselectNode: deselectNodeHandler,
              selectEdge: selectEdgeHandler,
              deselectEdge: deselectEdgeHandler,
            }}
        />
    </Box>
  );
}
