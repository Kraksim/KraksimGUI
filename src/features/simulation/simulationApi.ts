import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { Simulation, SimplifiedSimulation } from './types';
import type { CreateSimulationRequest, SimulateRequest } from './requests';
import type { StateStatistics } from './statistics/types';
import { Result } from './requests';

export const simulationApi = createApi({
  reducerPath: 'simulationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:8080/',
  }),
  tagTypes: ['Simulation', 'SimplifiedSimulation', 'Statistics'],
  endpoints: (builder) => ({
    getSimulationById: builder.query<Simulation, number>({
      query: (id) => ({ url: `simulation/${id}` }),
      providesTags: (result) =>
        result
          ? [{ id: result.id, type: 'Simulation' as const }, 'Simulation']
          : ['Simulation'],
    }),
    getAllSimulations: builder.query<SimplifiedSimulation[], void>({
      query: () => ({ url: 'simulation/all' }),
      providesTags: ['SimplifiedSimulation'],
    }),
    getSimulationBasicInfo: builder.query<SimplifiedSimulation[], number[]>({
      query: (ids) => ({ url: 'simulation/basic' + (ids.length > 0 ? '?' + ids.map(id => `id=${id}`).join('&') : '') }),
    }),
    createSimulation: builder.mutation<Simulation, CreateSimulationRequest>({
      query: (request) => ({
        url: 'simulation/create',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['Simulation', 'SimplifiedSimulation'],
    }),
    simulate: builder.mutation<Result, SimulateRequest>({
      query: ({ id, times }) => ({
        url: `simulation/simulate?id=${id}&times=${times}`,
        method: 'POST',
      }),
      invalidatesTags: (result, ignore, queryArg) =>
        result
          ? [
            { id: queryArg.id, type: 'Simulation' as const },
            { id: queryArg.id, type: 'Statistics' as const },
            { id: queryArg.id, type: 'SimplifiedSimulation' as const },
            'Simulation',
            'Statistics',
            'SimplifiedSimulation',
          ]
          : ['Simulation', 'Statistics', 'SimplifiedSimulation'],
    }),
    deleteSimulation: builder.mutation<void, number>({
      query: (id) => ({ url: `simulation/delete/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Simulation', 'SimplifiedSimulation'],
    }),
    populate: builder.mutation<Simulation, void>({
      query: () => ({ url: 'simulation/populate', method: 'POST' }),
      invalidatesTags: ['Simulation', 'SimplifiedSimulation'],
    }),
    getStatisticsFromSimulation: builder.query<StateStatistics[], number>({
      query: (simulationId) => ({
        url: `statistics/simulation/${simulationId}`,
      }),
      providesTags: (result) =>
        result && result.length > 0
          ? [
            { id: result[0].simulationId, type: 'Statistics' as const },
            'Statistics',
          ]
          : ['Statistics'],
    }),
  }),
});

export const {
  useCreateSimulationMutation,
  useGetAllSimulationsQuery,
  useGetSimulationByIdQuery,
  useSimulateMutation,
  useDeleteSimulationMutation,
  usePopulateMutation,
  useGetSimulationBasicInfoQuery,
  useGetStatisticsFromSimulationQuery,
} = simulationApi;
