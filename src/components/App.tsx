import { useState } from 'react';
import { Provider } from 'urql';
import { client } from './client';
import { SearchBar } from './SearchBar';
import type { Continent, Country } from './queries';
import { ContinentCard } from './ContinentCard';
import { CountryCard } from './CountryCard';

export const App = () => {
  const [selectedContinent, setSelectedContinent] = useState<null | Continent>(null);
  const [selectedCountry, setSelectedCountry] = useState<null | Country>(null);

  return <Provider value={client}>
    <div className="app">
      <section className="search-form">
        <h1>Search Continents</h1>
        <p>select a continent, drill down into countries, to see a country overview.</p>
        <SearchBar onSelectContinent={setSelectedContinent} />
      </section>
      <section className="continent-result">
        {selectedContinent ? <ContinentCard continent={selectedContinent} onSelectCountry={setSelectedCountry} /> : null}
      </section>
      <section className="country-result">
        {selectedCountry ? <CountryCard country={selectedCountry} /> : null}
      </section>
    </div>
  </Provider>
}