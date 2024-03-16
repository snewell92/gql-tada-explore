import { useQuery } from "urql";
import { getTopLevel, type Continent, type Country } from "./queries"

const CountryEntry = ({ country, onClick }: {country: Country, onClick: (c: Country) => void}) => {
  return <div className="country" onClick={() => onClick(country)}>{country.name} ({country.code})</div>
}

interface ContinentCardProps {
  continent: Continent;
  onSelectCountry: (country: Country) => void;
}

export const ContinentCard = ({ continent, onSelectCountry }: ContinentCardProps) => {

  const [ results ] = useQuery({ query: getTopLevel });
  if (!results.data) {
    return null;
  }

  const countries = results.data.countries.filter(c => c.continent.code === continent.code);
  const numCountries = countries.length;

  return <div className="continent-card">
    <h2>{continent.name} ({continent.code})</h2>
    <p>{numCountries} Countries</p>
    <div className="countries">
      {countries.map(c => <CountryEntry onClick={onSelectCountry} country={c} />)}
    </div>
  </div>
}