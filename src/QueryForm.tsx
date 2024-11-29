import React, { useState } from "react";

function QueryForm({ onSubmit }) {
  const [selectedTask, setSelectedTask] = useState("1");

  const queries = {
    1: `
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX dbr: <http://dbpedia.org/resource/>
    PREFIX dct: <http://purl.org/dc/terms/>
    
    SELECT ?country ?population
    WHERE {
      ?country dbo:populationTotal ?population ;
               dct:subject dbr:Category:Eastern_European_countries .
       
       FILTER (?country NOT IN( 
        dbr:Azerbaijan 
        dbr:Kazakhstan
        dbr:Abkhazia
        dbr:Armenia))
    }
    ORDER BY DESC(?population)
    `,
    2: `
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX dbr: <http://dbpedia.org/resource/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dct: <http://purl.org/dc/terms/>

    SELECT ?countryName 
          (GROUP_CONCAT(UCASE(?languageName); separator="|") AS ?languages)
    WHERE {
      ?country rdfs:label ?countryName .
      ?country dct:subject ?category .

      OPTIONAL {
        ?country dbo:language ?language .
        ?language rdfs:label ?languageName .
        FILTER (LANG(?languageName) = "en")
      }
      
      FILTER (LANG(?countryName) = "en")
      FILTER (STRSTARTS(?countryName, "A"))
      FILTER (?category IN (
        dbr:Category:Countries_in_Europe, 
        dbr:Category:Countries_in_North_America
      ))
    }
    GROUP BY ?countryName
    ORDER BY ASC(?countryName)
    `,
    3: `
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX dbr: <http://dbpedia.org/resource/>
    PREFIX dct: <http://purl.org/dc/terms/>

    SELECT ?laureate ?name ?birthDate
    WHERE {
      ?laureate dbo:award dbr:Nobel_Prize_in_Physics ;
                rdfs:label ?name ;
                dbo:birthDate ?birthDate .
      FILTER(LANG(?name) = "en")
    }
    ORDER BY ASC(?birthDate)



    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX dbr: <http://dbpedia.org/resource/>
    PREFIX dct: <http://purl.org/dc/terms/>

    SELECT ?university (COUNT(?laureate) AS ?laureatesCount)
    WHERE {
      ?laureate dbo:award dbr:Nobel_Prize_in_Physics ;
                dbo:almaMater ?university .
    }
    GROUP BY ?university
    ORDER BY DESC(?laureatesCount)
    LIMIT 10

    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX dbr: <http://dbpedia.org/resource/>
    PREFIX dct: <http://purl.org/dc/terms/>

    SELECT (COUNT(DISTINCT ?laureate) AS ?immigrantCount)
    WHERE {
      ?laureate dbo:award dbr:Nobel_Prize_in_Physics ;
                dbo:birthPlace ?birthPlace ;
                dbo:almaMater ?university .
      ?birthPlace dbo:country ?birthCountry .
      ?university dbo:country ?universityCountry .
      
      FILTER (?birthCountry != ?universityCountry)
    }
`,
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