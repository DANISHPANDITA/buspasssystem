import { combineReducers, createStore } from "redux";
import counterReducer from "./counterSlice";
import { loadState, saveState } from "./localStorage";

const persistedState = loadState();
const reducer = combineReducers({
  busPassApp: counterReducer,
});
const store = createStore(
  reducer,
  persistedState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
store.subscribe(() => saveState(store.getState()));
export default store;
