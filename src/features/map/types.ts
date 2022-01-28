import { GraphData } from 'react-vis-graph-wrapper';

import { MovementSimulationStrategyType } from '../simulation/types';


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

export type RoadNodeType = 'INTERSECTION' | 'GATEWAY';

export interface RoadNode {
  id: number;
  type: RoadNodeType;
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
  simulationsCount?: number
}

export interface ErrorWrapper<T> {
  result: T;
  errorMessage: string;
}

export interface BasicEdgeInfo {
  from: number;
  to: number;
  roadThickness: number;
  id?: number;
  roadName: string;
}

export interface BasicRoadNodeInfo {
  name: string;
  type: RoadNodeType;
  position: Position;
  id: number;
}


export interface EdgeCreationData {
  modeOn: boolean,
  firstNodeId: number | undefined
}

export interface ErrorState {
  isPresent: boolean,
  data: string | undefined
}

export type SetMapStateLambdaType = (value: (((prevState: GraphData) => GraphData) | GraphData)) => void;
