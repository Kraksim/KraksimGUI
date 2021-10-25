import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { CreateMapRequest } from './requests';
import { SimulationMap } from './types';

export const mapApi = createApi({
  reducerPath: 'mapApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.API_URL || 'http://localhost:8080/' }),
  tagTypes: ['Map', 'Id'],
  endpoints: (builder) => ({
    getMapById: builder.query<SimulationMap, number>({
      query: (id) => ({ url: `map/${id}` }),
      providesTags: (result) => 
        (result ? [{ type: 'Map', id: result.id }, 'Map'] : ['Map']),
    }),
    getAllMapIds: builder.query<number[], void>({
      query: () => ({ url: 'map/all' }),
      providesTags: ['Id'],
    }),
    createMap: builder.mutation<SimulationMap, CreateMapRequest>({
      query: (request) => ({ url: 'map/create', method: 'POST', body: request }),
      invalidatesTags: (result) => 
        (result ? [{ type: 'Map', id: result.id }, 'Map'] : ['Map']),
    }),
  }),
});

export const {
  useCreateMapMutation,
  useGetMapByIdQuery,
  useGetAllMapIdsQuery,
} = mapApi;