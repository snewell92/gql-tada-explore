import "react";
import { useCallback, type ChangeEvent, type KeyboardEvent, useState } from "react";
import { useQuery } from 'urql';
import debounce from "lodash.debounce";
import { getTopLevel, type Continent, type Continents } from "./queries";

const ShowContinent = ({ continent, onClick }: { continent: Continent, onClick: (continent: Continent) => void }) => {

  const handleClick = useCallback(() => onClick(continent), [continent])
  const handleKeyDown = useCallback((evt: KeyboardEvent<HTMLLIElement>) => {
    if (evt.key === "Enter") {
      handleClick();
    }
  }, [continent]);

  return <li tabIndex={0} className="continent result" key={continent.code} onKeyDown={handleKeyDown} onClick={handleClick}>{continent.name} ({continent.code})</li>
}

interface SearchProps {
  onSelectContinent: (continent: Continent | null) => void;
}

export const SearchBar = ({ onSelectContinent } : SearchProps) => {
  const [ results ] = useQuery({ query: getTopLevel });
  const [matches, setMatches] = useState<Continents>([]);
  const [newInput, setNewInput] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const hasContinentsLoaded = results.data && results.data.continents;
  const hasMatches = matches.length > 0;

  const search = useCallback(debounce((searchTerm: string) => {
    if (!results.data) {
      return;
    }

    setIsSearching(true);

    if (searchTerm.length === 1 && searchTerm === '*') {
      setMatches(results.data.continents);
      setNewInput(false);
      setIsSearching(false);
      return
    }

    let matches: Continents = [];
    for (const continent of results.data.continents) {
      if (String(continent.code).toLocaleLowerCase().includes(searchTerm) || continent.name.toLocaleLowerCase().includes(searchTerm)) {
        matches.push(continent)
      }
    }
    setMatches(matches);

    setNewInput(false);
    setIsSearching(false);
  }, 150), [results]);

  const handleChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = evt.target.value.trim().toLocaleLowerCase();

    if (searchTerm.length === 0) {
      setMatches([]);
      return;
    }

    onSelectContinent(null);
    setNewInput(true)
    search(searchTerm);
  }, [search]);

  const inputClass = ["search"];
  if (newInput) {
    inputClass.push("debounced");
  }
  if (isSearching) {
    inputClass.push("matching");
  }
  if (hasMatches) {
    inputClass.push("matched");
  }

  const inputCss = inputClass.join(" ");

  return <section>
    <h1>{results.fetching ? "loading data..." : "Search continents"}</h1>
    <input disabled={!hasContinentsLoaded} className={inputCss} type="text" onChange={handleChange} />
    {hasMatches ? <ul>{matches.map(match => <ShowContinent continent={match} onClick={onSelectContinent} />)}</ul> : null}
  </section>
}
