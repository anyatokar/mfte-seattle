import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";

import Form from "react-bootstrap/Form";

export interface ISearchProps {
  // Need to bubble up final query string to AllBuildings component.
  setSearchQuery: (searchQuery: string) => void;
}

const SearchInput: React.FC<ISearchProps> = ({ setSearchQuery }) => {
  const [inputValue, setInputValue] = useState<string | undefined>();
  // This runs every time component re-renders (on every keystroke).
  // But it only updates when user stops typing.
  const debouncedSearchQuery = useDebounce(inputValue);

  useEffect(() => {
    if (debouncedSearchQuery !== undefined) {
      setSearchQuery(debouncedSearchQuery);
    }
    // If the debounced value is not updated, we don't set the search query.
  }, [debouncedSearchQuery, setSearchQuery]);

  return (
    <Form onSubmit={(event) => event.preventDefault()} className="mb-1">
      <Form.Control
        placeholder="Search address, building name, neighborhood"
        id="search"
        type="search"
        aria-label="Search"
        onChange={(event) => setInputValue(event.target.value)}
        size="sm"
      />
    </Form>
  );
};

export default SearchInput;
