import { useState } from "react";
import Container from "../components/Container";
import TextField from "../components/TextInput";

const Search = () => {
  const [search, setSearch] = useState();

  const handleChange = (e) => {
    const { value } = e.target;

    setSearch(value);
  };

  return (
    <Container showBack noSearch>
      <div className="p-4">
        <TextField name="search" value={search || ""} handleChange={handleChange} startIcon="/svg/search-2.svg" />
      </div>
    </Container>
  );
};

export default Search;
