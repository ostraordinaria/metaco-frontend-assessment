import React from 'react';
import { Router } from 'react-router-dom';
import { ChakraProvider, theme } from '@chakra-ui/react';
import { createBrowserHistory } from 'history';

import Routes from 'routes';

const history = createBrowserHistory();

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Router history={history}>
        <Routes />
      </Router>
    </ChakraProvider>
  );
};

export default App;
