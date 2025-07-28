import React from "react";

export default function App() {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <p>Hello whats app Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>increase</button>
    </div>
  );
}
