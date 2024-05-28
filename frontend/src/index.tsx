import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import './styles/index.css';
import App from './App';
import ApolloProviderWrapper from './graphql/ApolloClient';
import store from './store';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <ApolloProviderWrapper>
      <App />
    </ApolloProviderWrapper>
  </Provider>
);
