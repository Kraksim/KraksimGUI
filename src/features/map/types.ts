import { MovementSimulationStrategyType } from '../simulation/types';

import { GraphData } from './VisGraph';

export interface Position {
  x: number;
  y: number;
}

interface Lane {
  id: number;
  startingPoint: number;
  endingPoint: number;
  indexFromLeft: number;
  name: string;
}

export interface Road {
  length: number;
  lanes: Lane[];
  id: number;
  name: string;
}

interface TurnDirection {
  sourceLane: Lane;
  destinationRoad: Road;
}

export interface RoadNode {
  id: number;
  type: 'INTERSECTION' | 'GATEWAY';
  position: Position;
  endingRoads: Road[];
  startingRoads: Road[];
  turnDirections?: TurnDirection[];
  name: string;
}

export type MapType = 'MAP' | 'NO_MAP';

export interface SimulationMap {
  type: MapType;
  roadNodes: RoadNode[];
  roads: Road[];
  id: number;
  name: string;
  compatibleWith: MovementSimulationStrategyType[];
  description: string;
}

export interface BasicMapInfo {
  type: MapType;
  id: number;
  name: string;
  nodes: BasicRoadNodeInfo[];
  edges: BasicEdgeInfo[];
  compatibleWith: MovementSimulationStrategyType[];
  description: string;
  simulationsCount: number
}

export interface ErrorWrapper<T> {
  result: T;
  errorMessage: string;
}

export interface BasicEdgeInfo {
  from: number;
  to: number;
  roadThickness: number;
}

export interface BasicRoadNodeInfo {
  name: string;
  type: 'INTERSECTION' | 'GATEWAY';
  position: Position;
  id: number;
}


export interface EdgeCreationData {
  modeOn: boolean,
  firstNodeName: string | undefined
}

export interface ErrorState {
  isPresent: boolean,
  data: string | undefined
}

export type SetMapStateLambdaType = (value: (((prevState: GraphData) => GraphData) | GraphData)) => void;
