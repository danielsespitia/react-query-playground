import './App.css';
import { useQuery } from 'react-query';
import { ReactQueryDevtools } from 'react-query-devtools';

import axios from 'axios';

function Pokemon() {
  //1 arg -> Unique key for fetched data
  //2 arg -> Function that'ps gonna grab some data (normally fetch is used and receives an API as an argument)
  //when using fetch, be sure to get a json as a result (investigar promesas en detalle)
  //Loading... state
  //Errors
  //3 arg -> config object

  const queryInfo = useQuery(
    'pokemon',
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // if (true) {
      //   throw new Error('Test error');
      // }
      return axios
        .get('https://pokeapi.co/api/v2/pokemon')
        .then((res) => res.data.results);
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  return queryInfo.isLoading ? (
    'Loading...'
  ) : queryInfo.isError ? (
    queryInfo.error.message
  ) : (
    <div>
      {queryInfo.data.map((result) => {
        return <div key={result.name}>{result.name}</div>;
      })}
    </div>
  );
}

export default function App() {
  return (
    <div>
      <Pokemon />
      <ReactQueryDevtools/>
    </div>
  );
}
