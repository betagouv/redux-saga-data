import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native

const persist = {
  key: 'transactions-youtube',
  storage,
  whitelist: [
    // 'data',
    // 'tracker',
    // 'user'
  ],
}

export default persist