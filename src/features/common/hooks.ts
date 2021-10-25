import { useLocation } from 'react-router-dom';

export function useUrlParamsQuery(): URLSearchParams {
  return new URLSearchParams(useLocation().search);
}