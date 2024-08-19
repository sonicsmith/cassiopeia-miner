import { useEffect, useState } from "react";

import "./index.css";

const getRandomHash = () => {
  return [1, 2, 3, 4]
    .map(() => Math.random().toString(16).slice(2, 10))
    .join("");
};

export const MiningAnimation = () => {
  const [hash, setHash] = useState<string>("");

  useEffect(() => {
    // Use setTimeout to update the message after 2000 milliseconds (2 seconds)
    const timeoutId = setInterval(() => {
      setHash(getRandomHash());
    }, 50);

    // Cleanup function to clear the timeout if the component unmounts
    return () => clearInterval(timeoutId);
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <div>
      <div className="loader m-auto" />
      <div className="mt-4">0x{hash}</div>
    </div>
  );
};
