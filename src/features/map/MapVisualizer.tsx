import { Box } from '@mui/material';
import React, { useState } from 'react';
import { random } from 'lodash';

import { BasicMapInfo, EdgeCreationData, Position } from './types';
import VisGraph, { GraphData, Node } from './VisGraph';
import { RoadNodeType } from './requests';

const NODE_SIZE = 50;
const DISTANCE_MULTIPLIER = 7;

interface Props {
  map: BasicMapInfo;
  interactable?: boolean;
  select?: (clickedNodeName: string) => void;
  doubleClick?: (
    x: number,
    y: number
  ) => { type: RoadNodeType; position: Position; name: string };
  onNodeMoved?: (x: number, y: number, nodeName: string) => void;
  edgeCreation?: {
    value: EdgeCreationData;
    setter: (
      value:
      | ((prevState: EdgeCreationData) => EdgeCreationData)
      | EdgeCreationData
    ) => void;
  };
}

function createNode(
  id: number,
  name: string,
  type: 'INTERSECTION' | 'GATEWAY',
  position: Position,
) {
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
  select,
  doubleClick,
  onNodeMoved,
  edgeCreation,
}: Props): JSX.Element {
  const [mapState, setMapState] = useState(createGraph(map));
  const additionalOptions = interactable ? {} : getStaticMapOptions();
  const edgeCreationMode = edgeCreation?.value;
  const setEdgeCreationMode = edgeCreation?.setter;

  function handleDoubleClick(event: any) {
    if (doubleClick) {
      const newNodeData = doubleClick(
        Math.round(event.pointer.canvas.x / DISTANCE_MULTIPLIER),
        Math.round(event.pointer.canvas.y / DISTANCE_MULTIPLIER),
      );

      setMapState((graph: GraphData) => {
        return {
          nodes: [
            ...graph.nodes,
            createNode(
              random(100, 999999),
              newNodeData.name,
              newNodeData.type,
              newNodeData.position,
            ),
          ],
          edges: [...graph.edges],
        };
      });
    }
  }

  function handleDragEnd(event: any) {
    if (event.nodes.length === 1) {
      const nodeMovedId = event.nodes[0];
      const nodeMoved = mapState.nodes.find((n) => n.id === nodeMovedId);
      if (nodeMoved && onNodeMoved) {
        const newX = Math.round(event.pointer.canvas.x / DISTANCE_MULTIPLIER);
        const newY = Math.round(event.pointer.canvas.y / DISTANCE_MULTIPLIER);

        nodeMoved.x = newX * DISTANCE_MULTIPLIER;
        nodeMoved.y = newY * DISTANCE_MULTIPLIER;

        onNodeMoved(newX, newY, nodeMoved.label ?? '');
      }
    }
  }

  function handleSelectInternal(clickedNode: Node) {
    const createEdgeToSelf = edgeCreationMode?.firstNodeName == clickedNode.label;
    const createEdge = edgeCreationMode && edgeCreationMode.modeOn && edgeCreationMode.firstNodeName;
    if (createEdgeToSelf) {
      return;
    }
    if (createEdge) {
      const firstNode = mapState.nodes.find((n) => n.label === edgeCreationMode.firstNodeName);
      if (firstNode) {
        setMapState((graph: GraphData) => {
          return {
            nodes: graph.nodes,
            edges: [
              { from: firstNode.id, to: clickedNode.id, value: 1 },
              ...graph.edges,
            ],
          };
        });
      }
    }
  }

  function handleSelect(nodes: any) {
    if (nodes.length == 1) {
      const nodeId = nodes[0];
      const clickedNode = mapState.nodes.find((n) => n.id === nodeId);
      if (clickedNode && clickedNode.label && select) {
        select(clickedNode.label);
        handleSelectInternal(clickedNode);
      }
    }
  }

  function handleDeselectNode() {
    if (setEdgeCreationMode) {
      setEdgeCreationMode((old) => {
        return { modeOn: old.modeOn, firstNodeName: undefined };
      });
    }
  }

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
              select: ({ nodes }) => handleSelect(nodes),
              doubleClick: handleDoubleClick,
              dragEnd: handleDragEnd,
              deselectNode: handleDeselectNode,
            }}
        />
      </Box>
  );
}
