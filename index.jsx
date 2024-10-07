const Countries = () => {
  const [countries, setCountries] = React.useState([]);
  const [searched, setSearched] = React.useState([]);
  const [mood, setMood] = React.useState(
    localStorage.getItem("mode") || "light"
  );
  const [input, setInput] = React.useState("");
  const [filter, setFilter] = React.useState("");
  const [picked, setPicked] = React.useState([false, []]);

  document.body.setAttribute("class", `bg-${mood}`);

  React.useEffect(() => {
    const countryData = async () => {
      //   const response = await fetch("https://restcountries.com/v3.1/all");
      const response = await fetch("./data.json");
      const data = await response.json();
      setCountries(data);
      setSearched(data);
    };
    countryData();
  }, []);

  const mode = (mood) => {
    if (mood === "light") {
      localStorage.setItem("mode", "dark");
      setMood("dark");
    } else {
      localStorage.setItem("mode", "light");
      setMood("light");
    }
  };

  const handleChange = (e) => {
    setInput(e.target.value);
    if (e.target.value.length > 0 && filter.length > 0 && filter !== "all") {
      setSearched(
        countries.filter((elem) => {
          return (
            elem.name.toLowerCase().includes(e.target.value.toLowerCase()) &&
            elem.region.toLowerCase() === filter
          );
        })
      );
    } else if (e.target.value.length > 0) {
      setSearched(
        countries.filter((elem) => {
          return elem.name.toLowerCase().includes(e.target.value.toLowerCase());
        })
      );
    } else {
      if (filter == "all" || filter == "") {
        setSearched(countries);
      } else {
        setSearched(
          countries.filter((elem) => elem.region.toLowerCase() == filter)
        );
      }
    }
  };
  const handleClick = (e) => {
    setFilter(e.target.value);
    console.log(e.target.value);
    if (e.target.value == "all" || (e.target.value == "" && input.length > 0)) {
      setSearched(
        countries.filter((elem) =>
          elem.name.toLowerCase().includes(input.toLowerCase())
        )
      );
    } else if (
      e.target.value !== "all" ||
      (e.target.value !== "" && input.length > 0)
    ) {
      setSearched(
        countries.filter((elem) => {
          return (
            elem.name.toLowerCase().includes(input.toLowerCase()) &&
            elem.region.toLowerCase() === e.target.value
          );
        })
      );
    } else if (
      e.target.value == "all" ||
      (e.target.value == "" && input.length == 0)
    ) {
      setSearched(countries);
    } else {
      setSearched(
        countries.filter((elem) => elem.region.toLowerCase() == e.target.value)
      );
    }
  };

  let findBorder = (country) => {
    let border = countries.filter(
      (item) => item.name == country && item.hasOwnProperty("borders")
    );

    if (border.length > 0) {
      let borders = border
        .map((item) =>
          item.borders
            .map((c) => countries.filter((d) => d.alpha3Code == c))
            .flat()
        )
        .flat();
      console.log(borders.map((c) => c.name));
      return borders.map((c) => c.name);
    } else {
      return false;
    }
  };

  return (
    <>
      <header className={mood}>
        <h1>Where in the world?</h1>
        <p
          className={`${mood}en btn icon`}
          id="mode"
          onClick={() => mode(mood)}
        >
          <i id="side" class="fa-solid fa-moon"></i>
          <span id="switch">{mood === "light" ? "Dark" : "Light"} Mode</span>
        </p>
      </header>
      <div className="main">
        <div className={`filters ${picked[0] ? "none" : ""}`}>
          <form>
            <div className="search-box">
              <div className="input-group input-group-lg">
                <span className={`input-group-addon icon ${mood}`}>
                  <i className="fa-solid fa-magnifying-glass"></i>
                </span>
                <input
                  onChange={(e) => handleChange(e)}
                  value={input}
                  type="text"
                  className={`form-control ${mood}`}
                  id="inp"
                  aria-describedby="inputGroupSuccess1Status"
                  placeholder="Search for a country"
                  autocomplete="off"
                />
              </div>
            </div>
            <select
              onClick={(e) => handleClick(e)}
              className={`form-select input-lg form-control ${mood}`}
              aria-label="Default select example"
            >
              <option disabled selected hidden value="all">
                Filter by region
              </option>
              <option value="all">All</option>
              <option value="africa">Africa</option>
              <option value="americas">America</option>
              <option value="asia">Asia</option>
              <option value="europe">Europe</option>
              <option value="oceania">Oceania</option>
            </select>
          </form>
          <div className={`message ${searched.length > 0 ? "none" : ""}`}>
            <p className="inner-msg">
              <i class="fa-solid fa-magnifying-glass sizer"></i>{" "}
              <p>
                Please Input A Valid Country Or Set Filter To{" "}
                <span class="bold note">"All"</span> Before Searching!!
              </p>
            </p>
          </div>
        </div>
        <div id="content" className={`blank ${picked[0] ? "none" : ""}`}>
          {searched.map((country) => (
            <div
              className={`tile btn ${mood}`}
              onClick={() => setPicked([true, [country]])}
            >
              <img src={country.flags.png} alt={`${country.name} flag`} />
              <div className="detail">
                <p className="random">{country.name}</p>
                <p>
                  <span className="bold">Population: </span>
                  {country.population.toLocaleString("en-US")}
                </p>
                <p>
                  <span className="bold">Region: </span>
                  {country.region}
                </p>
                <p>
                  <span className="bold">Capital: </span>
                  {country.capital == undefined
                    ? "Unknown Capital"
                    : country.capital}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className={`picked ${picked[0] ? "" : "none"}`}>
          <button
            className={`${mood} btn icon`}
            onClick={() => setPicked([false, []])}
          >
            <i class="fa-solid fa-arrow-left icon"></i> Back
          </button>
          {console.log(picked[1])}
          {picked[1].map((country) => (
            <div className="unique">
              <img src={country.flags.png} alt={`${country.name} flag`} />
              <div className="side">
                <div className="more-info">
                  <p className="info-head">{country.name}</p>
                  <div className="info">
                    <div className="info1">
                      <p>
                        <span className="bold">Native Name: </span>
                        {country.nativeName}
                      </p>
                      <p>
                        <span className="bold">Population: </span>
                        {country.population.toLocaleString("en-US")}
                      </p>
                      <p>
                        <span className="bold">Region: </span>
                        {country.region}
                      </p>
                      <p>
                        <span className="bold">Sub-Region: </span>
                        {country.subregion}
                      </p>
                      <p>
                        <span className="bold">Capital: </span>
                        {country.capital == undefined
                          ? "Unknown Capital"
                          : country.capital}
                      </p>
                    </div>
                    <div className="info2">
                      <p>
                        <span className="bold">Top Level Domain: </span>{" "}
                        {country.topLevelDomain.join(", ")}
                      </p>
                      <p>
                        <span className="bold">Currency: </span>
                        {country.currencies.map((item) => item.name).join("")}
                      </p>
                      <p>
                        <span className="bold">Languages: </span>
                        {country.languages.map((item) => item.name).join(", ")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="borders">
                  <p className="bold space">Border Countries: </p>
                  <div className="count">
                    {findBorder(country.name) == false ? (
                      <span className={`block icon ${mood}`}>
                        No Border Countries
                      </span>
                    ) : (
                      findBorder(country.name).map((item) => (
                        <span className={`block icon ${mood}`}>{item}</span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

ReactDOM.render(<Countries />, document.getElementById("data"));
