import React, { useState } from "react";
import QueryForm from "./QueryForm.tsx";
import ResultsTable from "./ResultsTable.tsx";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (query) => {
    setLoading(true);
    try {
      const response = await fetch("https://dbpedia.org/sparql", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `query=${encodeURIComponent(query)}&format=json`,
      });
      const result = await response.json();
      const bindings = result.results.bindings;
      setData(bindings);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>SPARQL Query Tasks</h1>
      <QueryForm onSubmit={fetchData} />
      {loading ? <p>Loading...</p> : <ResultsTable data={data} />}
    </div>
  );
}

export default App;