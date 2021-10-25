import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';

import { mapApi } from './map/mapApi';
import { simulationApi } from './simulation/simulationApi';

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [mapApi.reducerPath]: mapApi.reducer,
    [simulationApi.reducerPath]: simulationApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(simulationApi.middleware)
      .concat(mapApi.middleware),
});
export type Store = ReturnType<typeof store.getState>; 

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);