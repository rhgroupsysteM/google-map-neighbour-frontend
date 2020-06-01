import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
export default function PostCodes(props) {
  let [postCodes, setPostCodes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:7000/")
      .then((res) => res.json())
      .then((data) => setPostCodes(data.records));
  }, []);
  return (
    <div>
      <ul>
        {postCodes.map((post) => (
          <li>
            <a href={`/${post.name}`}>{post.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
