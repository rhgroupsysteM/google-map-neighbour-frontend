import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function PostCodes(props) {
  // let [postCodes, setPostCodes] = useState([]);

  // useEffect(() => {
  //   fetch("https://neighbour-lookup.herokuapp.com/")
  //     .then((res) => res.json())
  //     .then((data) => setPostCodes(data.records));
  // }, []);
  return (
    <div>
      <ul>{props.children}</ul>
    </div>
  );
}
