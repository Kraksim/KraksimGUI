import { CreateMapRequest } from '../../requests';
import { BasicEdgeInfo, BasicMapInfo, RoadNodeType } from '../../types';

import { InitialMapFormValues, PartialGateway, PartialIntersection } from './types';

export const initialSkeleton: CreateMapRequest = {
  name: 'Example name',
  description: 'Example description describing your awesome map',
  type: 'MAP',
  compatibleWith: ['NAGEL_SCHRECKENBERG', 'MULTI_LANE_NAGEL_SCHRECKENBERG'],
  roadNodes: [
    {
      type: 'GATEWAY',
      name: 'A',
      position: {
        x: 0,
        y: 0,
      },
      id: 10,
      endingRoadsIds: [],
      startingRoadsIds: [1],
    },
    {
      type: 'INTERSECTION',
      name: 'B',
      position: {
        x: 60,
        y: 40,
      },
      id: 20,
      endingRoadsIds: [1],
      startingRoadsIds: [2],
      overrideTurnDirectionsTurnEverywhere: true,
    },
    {
      type: 'GATEWAY',
      name: 'C',
      id: 30,
      position: {
        x: 0,
        y: 80,
      },
      endingRoadsIds: [2],
      startingRoadsIds: [],
    },
  ],
  roads: [
    {
      length: 72,
      name: 'A->B',
      lanes: [
        {
          startingPoint: 0,
          endingPoint: 72,
          indexFromLeft: 0,
          id: 0,
        },
        {
          startingPoint: 0,
          endingPoint: 72,
          indexFromLeft: 1,
          id: 1,
        },
      ],
      id: 1,
    },
    {
      length: 72,
      name: 'B->C',
      lanes: [
        {
          startingPoint: 0,
          endingPoint: 72,
          indexFromLeft: 0,
          id: 2,
        },
        {
          startingPoint: 0,
          endingPoint: 72,
          indexFromLeft: 1,
          id: 3,
        },
      ],
      id: 2,
    },
  ],
};


export const initialValues: InitialMapFormValues = {
  gateways: {
    [initialSkeleton.roadNodes[0].id as number]: {
      ...initialSkeleton.roadNodes[0],
    },
    [initialSkeleton.roadNodes[2].id as number]: {
      ...initialSkeleton.roadNodes[2],
    },
  },
  intersections: {
    [initialSkeleton.roadNodes[1].id as number]: {
      ...initialSkeleton.roadNodes[1],
    },
  },
  roads: {
    [initialSkeleton.roads[0].id as number]: {
      ...initialSkeleton.roads[0],
    },
    [initialSkeleton.roads[1].id as number]: {
      ...initialSkeleton.roads[1],
    },
  },
  name: 'Example name',
  description: 'Example description describing your awesome map',
  compatibleWith: [],
};

function calculateEdges(formValues: InitialMapFormValues): BasicEdgeInfo[]{
  const fromMap = new Map<number, PartialGateway | PartialIntersection>();
  const toMap = new Map<number, PartialGateway | PartialIntersection>();
  [...Object.entries(formValues.intersections), ...Object.entries(formValues.gateways)]
    .forEach(([, value]) => {
      value.startingRoadsIds.forEach(roadId => {
        fromMap.set(roadId, value);
      });
      value.endingRoadsIds.forEach(roadId => {
        toMap.set(roadId, value);
      });
    });
  return Object.entries(formValues.roads).map(([key, value]) => ({
    from: fromMap.get(parseInt(key))?.id as number,
    to: toMap.get(parseInt(key))?.id as number,
    roadThickness: value.lanes.length,
    roadName: value.name,
    id: value.id,
  }));
}

export function mapFormValuesToBasicMap(formValues: InitialMapFormValues): BasicMapInfo{
  const nodes = [...Object.entries(formValues.intersections),
    ...Object.entries(formValues.gateways)].map(([key, value]) => {
    return {
      id: parseInt(key),
      name: value.name,
      type: value.type,
      position: value.position,
    };
  });

  const edges = calculateEdges(formValues);
  
  return {
    type: 'MAP',
    id: 0,
    nodes: nodes,
    edges: edges,
    description: 'Testowa',
    name: 'Testowa',
    compatibleWith: [],
  };
}

function parseRoadNodes(node: PartialGateway | PartialIntersection): PartialGateway | PartialIntersection{
  if (node.type === 'GATEWAY' ){
    return node;
  } else {
    const castedNode = node as PartialIntersection;
    return {
      ...castedNode,
      turnDirections: castedNode.overrideTurnDirectionsTurnEverywhere ? undefined : castedNode.turnDirections,
    };
  }
}

export function parseFormValuesToRequest(values: InitialMapFormValues): CreateMapRequest{
  return {
    type: 'MAP',
    roadNodes: [...Object.entries(values.gateways), ...Object.entries(values.intersections)]
      .map(([, val]) => ({ ...parseRoadNodes(val) })),
    roads: Object.entries(values.roads).map(([, val]) => ({ ...val })),
    compatibleWith: values.compatibleWith,
    name: values.name,
    description: values.description,
  };
}

export function getRoadNodesFormikPrefix(type: RoadNodeType): string{
  return type === 'INTERSECTION' ? 'intersections' : 'gateways';
}