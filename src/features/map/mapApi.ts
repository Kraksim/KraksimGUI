import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { CreateMapRequest } from './requests';
import { BasicMapInfo, ErrorWrapper, SimulationMap } from './types';

export const mapApi = createApi({
  reducerPath: 'mapApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:8080/',
  }),
  tagTypes: ['Map', 'BasicMap'],
  endpoints: (builder) => ({
    getMapById: builder.query<SimulationMap, number>({
      query: (id) => ({ url: `map/${id}` }),
      providesTags: (result) =>
        result ? [{ type: 'Map', id: result.id }, 'Map'] : ['Map'],
    }),
    getAllMapsBasicInfo: builder.query<BasicMapInfo[], void>({
      query: () => ({ url: 'map/all' }),
      providesTags: ['BasicMap'],
    }),
    createMap: builder.mutation<SimulationMap, CreateMapRequest>({
      query: (request) => ({
        url: 'map/create',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: (result) =>
        result ? [{ type: 'Map', id: result.id }, 'Map',
          { type: 'BasicMap', id: result.id }, 'BasicMap',
        ] : ['Map', 'BasicMap'],
    }),
    getBasicMapById: builder.query<BasicMapInfo, number>({
      query: (id) => ({ url: `map/basic/${id}` }),
      providesTags: ['BasicMap'],
    }),
    validateMap: builder.mutation<ErrorWrapper<BasicMapInfo>, CreateMapRequest>({
      query: (request) => ({
        url: 'map/validate',
        method: 'POST',
        body: request,
      }),
    }),
  }),
});

export const {
  useCreateMapMutation,
  useGetMapByIdQuery,
  useGetAllMapsBasicInfoQuery,
  useGetBasicMapByIdQuery,
  useValidateMapMutation,
} = mapApi;
