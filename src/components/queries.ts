import { graphql, type ResultOf } from "gql.tada";

export const getTopLevel = graphql(`
query getTopLevel {
  continents {
    code
    name
  }

  countries {
    code
    name
    continent { code }
    emoji
    capital
    currencies
  }
}`);

type TopLevel = ResultOf<typeof getTopLevel>;

export type Continents = TopLevel["continents"];
export type Countries = TopLevel["countries"];

export type Continent = Continents[0];
export type Country = Countries[0];

export const getStatesForCountry = graphql(`
query getCountryState($countryCode: ID!) {
  country(code: $countryCode) {
    subdivisions { name code }
    states { name code }
  }
}`);

type CountryDataResult = ResultOf<typeof getStatesForCountry>;

type CountryData = NonNullable<CountryDataResult["country"]>;

export type Subdivision = CountryData["subdivisions"][0]
export type State = CountryData["states"][0]

