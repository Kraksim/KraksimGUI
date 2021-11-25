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