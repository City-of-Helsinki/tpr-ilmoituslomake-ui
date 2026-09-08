import { useMemo } from "react";
import { configureStore, type PreloadedState } from "@reduxjs/toolkit";
import type { Store } from "redux";
import { rootReducer, RootState } from "./reducers";

// Keep a reference to the store
let store: Store<RootState> | undefined;

// Function to create a new store using RTK
const createReduxStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    // RTK includes thunk middleware by default. 
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  });
};

// Initialize the store with optional preloaded state, handling SSR/SSG
export const initStore = (preloadedState?: RootState): Store<RootState> => {
  let newStore = store ?? createReduxStore(preloadedState);

  // Merge preloadedState with existing store state if needed (e.g., for navigation)
  if (preloadedState && store) {
    newStore = createReduxStore({
      ...store.getState(),
      ...preloadedState,
    });
    store = undefined; // Reset the current store to allow the new merged store to be used
  }

  // For SSR/SSG always create a new store
  if (typeof window === "undefined") {
    return newStore;
  }

  // Create the store once in the client
  if (!store) {
    store = newStore;
  }

  return newStore;
};

// Hook to use the store in React components
export const useStore = (preloadedState?: RootState): Store<RootState> => {
  return useMemo(() => initStore(preloadedState), [preloadedState]);
};