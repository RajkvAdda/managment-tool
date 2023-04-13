import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import { createStateSyncMiddleware, initMessageListener } from 'redux-state-sync';

import rootReducer, { masterMiddleware } from './combineReducer';

const encryptor = encryptTransform({
  secretKey: 'cmt-rajKV@1991',
  onError() {
    sessionStorage.clear();
    window.location.href = '/';
  },
});

export const getQuery = (filter: {
  [x: string]: any;
  page?: number;
  limit?: number;
  sort?: string;
  search?: { name: string } | { name: string } | { name: string } | { name: string } | { name: string };
}) => {
  // limit=5&page=1&sort=-name&name[regex]=rona&name[options]=i
  let query;
  for (const key in filter) {
    if (key === 'search') {
      let searchQuery;
      for (const searchKey in filter[key]) {
        const value = filter?.[key]?.[searchKey] ?? '';
        if (value?.length) {
          searchQuery = searchQuery
            ? `${searchQuery}&${searchKey}[regex]=${value}&${searchKey}[options]=i`
            : `${searchKey}[regex]=${value}&${searchKey}[options]=i`;
        }
      }
      query = searchQuery ? `${query}&${searchQuery}` : query;
    } else {
      query = query ? `${query}&${key}=${filter[key]}` : `${key}=${filter[key]}`;
    }
  }
  return query?.trim();
};

const persistConfig = {
  key: 'auth',
  version: 1,
  storage,
  whitelist: ['auth'],
  transforms: [encryptor],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      createStateSyncMiddleware({
        whitelist: ['auth/setLoginData'],
      }),
      masterMiddleware
    ),
});

initMessageListener(store);

const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export { store, persistor };
