export interface StatisticsForEntity<T> {
  turn: number;
  entityId: number;
  value: T;
}

export interface Series {
  data: Array<StatisticsForEntity<number>>;
  label: string;
  color?: string | undefined;
}
