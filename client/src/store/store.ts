import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { medSlice } from "./reducers/medReducer";

const reducers = combineReducers({
  med: medSlice.reducer,
});

const persistConfig = {
  key: "root",
  storage,
};

export const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
