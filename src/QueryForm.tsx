import React, { useState } from "react";

function QueryForm({ onSubmit }) {
  const [selectedTask, setSelectedTask] = useState("1");

  const queries = {
    1: `
      PREFIX dct: <http://purl.org/dc/terms/>
      PREFIX dbc: <http://dbpedia.org/resource/Category:>
      PREFIX dbo: <http://dbpedia.org/ontology/>
      SELECT ?country ?population WHERE {
        ?country dct:subject dbc:Eastern_Europe ;
                 a dbo:Country ;
                 dbo:populationTotal ?population .
      }
      ORDER BY DESC(?population)
    `,
    2: `
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX dbr: <http://dbpedia.org/resource/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX bif: <http://www.openlinksw.com/schemas/bif#>

    SELECT ?countryName (GROUP_CONCAT(UCASE(STR(?languageName)); SEPARATOR="|") AS ?languages) WHERE {
      ?country a dbo:Country ;
              rdfs:label ?countryName ;
              dbo:continent ?continent .
      FILTER (lang(?countryName) = "en")
      FILTER (?continent IN (dbr:Europe, dbr:North_America))
      FILTER (STRSTARTS(?countryName, "A"))
      
      OPTIONAL {
        ?country dbo:officialLanguage ?language .
        ?language rdfs:label ?languageName .
        FILTER (lang(?languageName) = "en")
      }
    }
    GROUP BY ?countryName
    ORDER BY ?countryName
    `,
    3: `
      PREFIX dbo: <http://dbpedia.org/ontology/>
      PREFIX dbr: <http://dbpedia.org/resource/>
      SELECT ?laureate ?university ?country WHERE {
        ?laureate dbo:award dbr:Nobel_Prize_in_Physics ;
                  dbo:almaMater ?university ;
                  dbo:birthPlace ?country .
      }
    `
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(queries[selectedTask]);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        Select Task:
        <select value={selectedTask} onChange={(e) => setSelectedTask(e.target.value)}>
          <option value="1">Task 1</option>
          <option value="2">Task 2</option>
          <option value="3">Task 3</option>
        </select>
        <button type="submit">Run Query</button>
      </form>
    </div>
  );
}

export default QueryForm;