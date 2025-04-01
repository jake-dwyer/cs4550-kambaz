import { useState } from "react";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;

export default function QueryParameters() {
  const [a, setA] = useState("34");
  const [b, setB] = useState("23");

  return (
    <div id="wd-query-parameters">
      <h3>Query Parameters</h3>

      <input
        className="form-control mb-2"
        type="number"
        value={a}
        onChange={(e) => setA(e.target.value)}
      />

      <input
        className="form-control mb-2"
        type="number"
        value={b}
        onChange={(e) => setB(e.target.value)}
      />

      <a
        className="btn btn-primary me-2"
        href={`${REMOTE_SERVER}/lab5/calculator?operation=add&a=${a}&b=${b}`}
        target="_blank"
        rel="noreferrer"
      >
        Add {a} + {b}
      </a>

      <a
        className="btn btn-danger me-2"
        href={`${REMOTE_SERVER}/lab5/calculator?operation=subtract&a=${a}&b=${b}`}
        target="_blank"
        rel="noreferrer"
      >
        Subtract {a} - {b}
      </a>
      <a
        className="btn btn-success me-2"
        href={`${REMOTE_SERVER}/lab5/calculator?operation=multiply&a=${a}&b=${b}`}
        target="_blank"
      >
        Multiply {a} × {b}
      </a>

      <a
        className="btn btn-warning"
        href={`${REMOTE_SERVER}/lab5/calculator?operation=divide&a=${a}&b=${b}`}
        target="_blank"
      >
        Divide {a} ÷ {b}
      </a>

      <hr />
    </div>
  );
}
