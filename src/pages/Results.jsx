import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Results() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    API.get("/results")
      .then((res) => setResults(res.data.results))
      .catch((err) => console.error(err));
  }, []);

  if (!results.length)
    return <p className="text-center mt-10 text-gray-600">No results found.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-4 text-center">Your Results</h2>
      <div className="grid gap-4">
        {results.map((r) => (
          <div key={r._id} className="bg-white p-4 shadow rounded flex justify-between items-center">
            <div>
              <p className="font-semibold">{r.title}</p>
              <p className="text-sm text-gray-500">
                {r.technology} | {r.level}
              </p>
            </div>
            <p className="font-bold text-blue-600">{r.score}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
