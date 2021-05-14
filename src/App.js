import React from 'react';
import './App.css';
import { useQuery } from 'react-query';
import { ReactQueryDevtools } from 'react-query-devtools';

import axios, { CancelToken } from 'axios';
// just one fetch for two queries with the same data
export default function App() {
  const [pokemon, setPokemon] = React.useState('');
  return (
    <div>
      <Count />
      <input value={pokemon} onChange={(e) => setPokemon(e.target.value)} />
      <PokemonSearch pokemon={pokemon} />
      <br />
      <Pokemon />
      <Berries />
      <ReactQueryDevtools />
    </div>
  );
}

function PokemonSearch({ pokemon }) {
  const queryInfo = useQuery(
    ['pokemon', pokemon],
    () => {
      //repasar
      const source = CancelToken.source();

      const promise = new Promise((resolve) => setTimeout(resolve, 1000))
        .then(() => {
          return axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`, {
            cancelToken: source.token,
          });
        })
        .then((res) => res.data);

      promise.cancel = () => {
        source.cancel('Query was cancelled by React Query');
      };

      return promise;
    },
    {
      //set how many times  I want the request to retry
      // retry: 1,
      //set the time between retry attempts
      // retryDelay: 1000,
      // just enable the query when there's a pokemon
      enabled: pokemon,
    }
  );

  return queryInfo.isLoading ? (
    'Loading...'
  ) : queryInfo.isError ? (
    queryInfo.error.message
  ) : (
    <div>
      {queryInfo.data?.sprites?.front_default ? (
        <img src={queryInfo.data.sprites.front_default} alt="pokemon" />
      ) : (
        'Pokemon not found.'
      )}
      <br />
      {queryInfo.isFetching ? 'Updating...' : null}
    </div>
  );
}

//Custom hook
//React query useQueryhook to share data across entire app, easier than context because the context is handled behind the scenes throughout the app
function usePokemon() {
  //1 arg -> Unique key for fetched data
  //2 arg -> Function that'ps gonna grab some data (normally fetch is used and receives an API as an argument)
  //when using fetch, be sure to get a json as a result (investigar promesas en detalle)
  //Loading... state
  //Errors
  //3 arg -> config object
  return useQuery('pokemons', async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return axios
      .get('https://pokeapi.co/api/v2/pokemon')
      .then((res) => res.data.results);

    //avoid refresh on browser window focus
    //stale time: avoid refreshing often
    //inactive: when it isn't showing in the app, cacheTime: time before removing inactive data from cache
  });
}

function Count() {
  const queryInfo = usePokemon();

  return <h3>You are looking at {queryInfo.data?.length} pokemon</h3>;
}

function Pokemon() {
  const queryInfo = usePokemon();

  return queryInfo.isLoading ? (
    'Loading...'
  ) : queryInfo.isError ? (
    queryInfo.error.message
  ) : (
    <div>
      {queryInfo.data.map((result) => {
        return <div key={result.name}>{result.name}</div>;
      })}
      <br />
      {queryInfo.isFetching ? 'Updating...' : null}
    </div>
  );
}

function Berries() {
  const queryInfo = useQuery('berries', async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return axios
      .get('https://pokeapi.co/api/v2/berry')
      .then((res) => res.data.results);

    //avoid refresh on browser window focus
    //stale time: avoid refreshing often
    //inactive: when it isn't showing in the app, cacheTime: time before removing inactive data from cache
  });

  return queryInfo.isLoading ? (
    'Loading...'
  ) : queryInfo.isError ? (
    queryInfo.error.message
  ) : (
    <div>
      {queryInfo.data.map((result) => {
        return <div key={result.name}>{result.name}</div>;
      })}
      <br />
      {queryInfo.isFetching ? 'Updating...' : null}
    </div>
  );
}
