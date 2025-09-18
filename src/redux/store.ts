import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '@/redux/feature/auth/auth-slice';
import orgReducer from '@/redux/feature/organization/organization-slice';
import orgMembersReducer from '@/redux/feature/organization/member-slice';

// import visitorReducer from "./features/visitors/visitor-slice";
// import departmentReducer from "./features/department/department-slice";
// import designationReducer from "./features/designation/designation-slice";
// import userReducer from "./features/user/user-slice";

const rootReducer = combineReducers({
  auth: authReducer,
  organization: orgReducer,
  orgMembers: orgMembersReducer,
  //   visitor: visitorReducer,
  //   department: departmentReducer,
  //   designation: designationReducer,
  //   user: userReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  blacklist: [
    'organization',
    'orgMembers',
    'visitor',
    'department',
    'designation',
    'user',
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
