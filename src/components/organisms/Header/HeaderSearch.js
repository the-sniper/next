import { Button } from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

const HeaderSearchComponent = (props) => {
  const [inputVal, setInputVal] = useState("");
  const [search, searchPage] = useState("");
  const handleChange = (e) => setInputVal(e.target.value);
  let router = useRouter();

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      router.push(`/search?title=${inputVal}`);
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    router.push(`/search?title=${inputVal}`);
  };

  return (
    <form>
      <div className="form-inline my-2 my-lg-0 headerSearchForm">
        <>
          <input
            type="text"
            onChange={handleChange}
            name="title"
            value={inputVal}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search..."
            aria-label="Search"
            className="nav-standard-top-area-search-input open-sans"
          />
          <Button
            onClick={handleClick}
            className="lin lin-magnifier nav-standard-top-area-search-sumbit"
          >
            <span className="material-icons">search</span>
          </Button>
        </>
      </div>
    </form>
  );
};

export default HeaderSearchComponent;
