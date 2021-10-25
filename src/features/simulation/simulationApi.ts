import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type {
  Simulation, SimplifiedSimulation,
} from './types';
import type {
  CreateSimulationRequest, SimulateRequest,
} from './requests';

export const simulationApi = createApi({
  reducerPath: 'simulationApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.API_URL || 'http://localhost:8080/' }),
  tagTypes: ['Simulation', 'SimplifiedSimulation'],
  endpoints: (builder) => ({
    getSimulationById: builder.query<Simulation, number>({
      query: (id) => ({ url: `simulation/${id}` }),
      providesTags: (result) =>  
        (result ? [{ id: result.id, type: 'Simulation' as const }, 'Simulation'] : ['Simulation']),
    }),
    getAllSimulations: builder.query<SimplifiedSimulation[], void>({
      query: () => ({ url: 'simulation/all' }),
      providesTags: ['SimplifiedSimulation'],
    }),
    createSimulation: builder.mutation<Simulation, CreateSimulationRequest>({
      query: (request) => ({ url: 'simulation/create', method: 'POST', body: request }),
      invalidatesTags: ['Simulation', 'SimplifiedSimulation'],
    }),
    simulate: builder.mutation<Simulation, SimulateRequest>({
      query: ({ id, times }) => ({ url: `simulation/simulate?id=${id}&times=${times}`, method: 'POST' }),
      invalidatesTags: (result) => 
        (result ? [{ id: result.id, type: 'Simulation' as const }, 'Simulation'] : ['Simulation']),
    }),
    deleteSimulation: builder.mutation<void, number>({
      query: (id) => ({ url: `simulation/delete?id=${id}`, method: 'DELETE' }),
      invalidatesTags: ['Simulation', 'SimplifiedSimulation'],
    }),
    populate: builder.mutation<Simulation, void>({
      query: () => ({ url: 'simulation/populate', method: 'POST' }),
      invalidatesTags: ['Simulation', 'SimplifiedSimulation'],
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
} = simulationApi;