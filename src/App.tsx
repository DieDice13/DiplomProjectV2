import { useRoutes } from 'react-router-dom';
import { routes } from './routes';
import { useAuthInit } from './hooks/useAuthInit';
import { Toaster } from 'react-hot-toast';

const App = () => {
  useAuthInit();

  const routing = useRoutes(routes);

  return (
    <>
      <Toaster position="top-right" />
      {routing}
    </>
  );
};

export default App;
