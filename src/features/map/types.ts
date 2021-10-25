interface Position {
  x: number,
  y: number
}

interface Lane {
  id: number,
  startingPoint: number,
  endingPoint: number,
  indexFromLeft: number,
}


export interface Road {
  length: number, 
  lanes: Lane[],
  id: number,
}

interface TurnDirection {
  sourceLane: Lane,
  destinationRoad: Road,
}

export interface RoadNode {
  id: number,  
  type: 'INTERSECTION' | 'GATEWAY',
  position: Position,
  endingRoads: Road[],
  startingRoads: Road[],
  turnDirections?: TurnDirection[],
}

export type MapType = 'MAP' | 'NO_MAP';

export interface SimulationMap {
  type: MapType,
  roadNodes: RoadNode[],
  roads: Road[],
  id: number,
}