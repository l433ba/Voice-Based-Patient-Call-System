import * as React from 'react';
import * as ReactNativeScript from 'react-nativescript';
import { MainStack } from './components/MainStack';
import { AuthProvider } from './contexts/AuthContext';

Object.defineProperty(global, '__DEV__', { value: false });

const App = () => (
  <AuthProvider>
    <MainStack />
  </AuthProvider>
);

ReactNativeScript.start(React.createElement(App, {}, null));