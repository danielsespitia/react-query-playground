import './App.css';
import { useQuery } from 'react-query';
import { ReactQueryDevtools } from 'react-query-devtools';

import axios from 'axios';

export default function App() {
  return (
    <div>
      <Pokemon queryKey='pokemon1'/>
      <Pokemon queryKey='pokemon2'/>
      <ReactQueryDevtools />
    </div>
  );
}

function Pokemon({ queryKey }) {
  //1 arg -> Unique key for fetched data
  //2 arg -> Function that'ps gonna grab some data (normally fetch is used and receives an API as an argument)
  //when using fetch, be sure to get a json as a result (investigar promesas en detalle)
  //Loading... state
  //Errors
  //3 arg -> config object

  const queryInfo = useQuery(
    queryKey,
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // if (true) {
      //   throw new Error('Test error');
      // }
      return axios
        .get('https://pokeapi.co/api/v2/pokemon')
        .then((res) => res.data.results);
    }
    //avoid refresh on browser window focus
    //stale time: avoid refreshing often
    //inactive: when it isn't showing in the app, cacheTime: time before removing inactive data from cache
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
      {queryInfo.isFetching ? 'Updating...' : null}
    </div>
  );
}
