import React from "react";
import searchLogo from "../search.svg";

function Search({ searchTerm, setSearchTerm }: string) {
  return (
    <div className="search">
      <div>
        <img src={searchLogo} alt="search" />
        <input
          type="text"
          placeholder="Search through thousands of movies"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
}

export default Search;
