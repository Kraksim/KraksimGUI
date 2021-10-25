import { MapType, Road, RoadNode } from './types';

export interface CreateMapRequest {
  type: MapType,
  roadNodes: RoadNode[],
  roads: Road[],
}