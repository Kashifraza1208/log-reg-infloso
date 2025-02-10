import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./redux/reducers";
import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from "react-redux";

import { persistStore } from "redux-persist";

const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.VITE_APP_ENABLE_REDUX_DEV_TOOLS === "true",
});

export const persistor = persistStore(store);

export const useSelector = useReduxSelector;
export const useDispatch = () => useReduxDispatch();

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
