import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import { Form } from "react-bootstrap"

export interface ISearchProps {
  onChangeSearchQuery: (searchQuery: string) => void;
}

export default function SearchInput(props: ISearchProps) {
  const [searchQuery, setSearchQuery] = useState<string | undefined>();
  const { onChangeSearchQuery } = props;
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (debouncedSearchQuery !== undefined) {
      onChangeSearchQuery(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, onChangeSearchQuery]);

  return (
    <Form>
      <Form.Label htmlFor="search" className="mt-3">
        Search for buildings with MFTE apartments: 
      </Form.Label>
      <Form.Text id="search-suggestions" muted>
        Enter neighborhood, building name, address or zip code.
      </Form.Text>
      <Form.Control
        id="search"
        className="form-control"
        type="search"
        aria-label="Search"
        onChange={(event) => setSearchQuery(event.target.value)}
      />
    </Form>
  );
}
