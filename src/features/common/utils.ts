export function minOrDefault(values: number[], defaultVal: number):number {
  const result = Math.min(...values);
  if (!isFinite(result))
    return defaultVal;
  return result;
}

export function maxOrDefault(values: number[], defaultVal: number):number {
  const result = Math.max(...values);
  if (!isFinite(result))
    return defaultVal;
  return result;
}

export function arraysIntersect<T>(first:T[], second:T[]): boolean {
  return first.filter(value => second.includes(value)).length > 0;
}

export function isBlank(str: string | undefined): boolean {
  return (!str || /^\s*$/.test(str));
}