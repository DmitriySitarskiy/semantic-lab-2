import React from "react";

function ResultsTable({ data }) {
  if (!data || data.length === 0) return <p>No results to display.</p>;

  const headers = Object.keys(data[0]);

  return (
    <div>
      <h1>test</h1>
      <table style={{ marginTop: "20px", width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {headers.map((header) => (
                <td key={header}>
                  {row[header].type === "uri" ? (
                    <a href={row[header].value} target="_blank" rel="noopener noreferrer">
                      {row[header].value}
                    </a>
                  ) : (
                    row[header].value
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ResultsTable;
