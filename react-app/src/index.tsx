import { createRoot } from "react-dom";
import { useEffect } from "react";
import "./index.css";

function MyFirstApp() {
  return (
    <div>
      <h1 class="text-3xl font-bold underline text-red-500">Hello world!</h1>
      <span>Hello from JavaScript!</span>;
    </div>
  );
}

window.addEventListener(
  "load",
  function () {
    const root = createRoot(document.getElementById("ypo-admin-page"));
    root.render(<MyFirstApp />);
  },
  false
);
