import { useQuery } from "urql"
import { getStatesForCountry, type Country, type Subdivision, type State } from "./queries"

const CurrencyInfo = ({ currencies } : {currencies: Array<string>}) => {
  const hasMultipleCurrencies = currencies.length > 1;

  if (!hasMultipleCurrencies) {
    const currency = currencies[0];
    return <h3>Currency: <a target="_blank" rel="noopener" href={getCurrencyLink(currency)}>{currency}</a></h3>
  }

  const firstCurrency = currencies[0];
  const restCurrencies = currencies.slice(1);

  return <h3>Currencies: <a target="_blank" rel="noopener" href={getCurrencyLink(firstCurrency)}>{firstCurrency}</a>, {restCurrencies.join(", ")}</h3>
}

type Province = State | Subdivision;

interface ProvinceProps {
  province: Province;
}

const Province = ({ province }: ProvinceProps) => {
  return <li>{province.name} {province.code && <span>({province.code})</span>}</li>
}

interface CountryCardProps {
  country: Country
}

export const CountryCard = ({ country }: CountryCardProps) => {
  const [ results ] = useQuery({
    query: getStatesForCountry,
    variables: { countryCode: country.code}
  });

  if (results.fetching) {
    return <div>Loading...</div>;
  }

  if (!results.data || !results.data.country) {
    return <div>No country found</div>
  }

  const countryData = results.data.country;

  const numStates = countryData.states.length || 0;
  const numSubDivisions = countryData.subdivisions.length || 0
  const numSmallerBits = numStates + numSubDivisions;

  // concat is strict so we widen our type
  const provinces = (countryData.subdivisions as Array<Province>).concat(countryData.states);

  return <div>
    <h2><a target="_blank" rel="noopener" href={wikiLink(country.name)}>{country.name}</a> ({country.code}) {country.emoji}</h2>
    <h3>Capital: <a target="_blank" rel="noopener" href={getCapitalWiki(country.capital)}>{country.capital || "N/A"}</a></h3>
    <CurrencyInfo currencies={country.currencies} />
    <h3>{numSmallerBits} Parts ({numStates} States + {numSubDivisions} Subdivisions)</h3>
    <p><em>All States & Subdivisions</em></p>
    <ul className="provinces">
      {provinces.map(p => <Province  province={p}/>)}
    </ul>
  </div>
}

function getCapitalWiki(capitalName: string | null) {
  if (!capitalName || capitalName.length === 0) {
    return "#";
  }

  return wikiLink(capitalName);
}

function wikiLink(thing: string) {
  const snakeCaseCapital = thing.toLowerCase().replaceAll(" ", "_");

  return `https://wikipedia.org/wiki/${snakeCaseCapital}`
}

function getCurrencyLink(code: string | undefined) {
  if (code === "USD") {
    return "https://www.xe.com/currency/usd-us-dollar/";
  }

  if (!code) {
    return "#";
  }

  return xeLink(code);
}

function xeLink(code: string) {
  return `https://www.xe.com/currencycharts/?from=USD&to=${code}`;
}
