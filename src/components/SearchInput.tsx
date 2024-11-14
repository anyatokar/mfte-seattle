import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";

import Form from "react-bootstrap/Form";

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
    <Form onSubmit={(event) => event.preventDefault()}>
      <Form.Control
        placeholder="Search address, neighborhood, building name"
        id="search"
        type="search"
        aria-label="Search"
        onChange={(event) => setSearchQuery(event.target.value)}
      />
    </Form>
  );
}
