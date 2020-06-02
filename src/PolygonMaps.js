import React, { useEffect, useState } from "react";
import Map from "./Map";
import PostCodes from "./PostCodes";
import { Link } from "react-router-dom";
import axios from "axios";

function PostCode(props) {
  let [isEnabled, toggleCoordinates] = useState(true);
  useEffect(() => {
    if (isEnabled) {
      //   fetch(`https://neighbour-lookup.herokuapp.com/${props.name}`)
      //     .then((res) => res.json())
      //     .then((data) => {
      //       props.setSelectedPostCodes([
      //         ...props.selectedPostCodes,
      //         { ...data.postcode },
      //       ]);
      //     });
    } else {
      props.setSelectedPostCodes(
        props.selectedPostCodes.filter(
          (postCode) => postCode["properties"]["name"] !== props.name
        )
      );
    }
  }, [isEnabled]);
  return (
    <li key={props.id}>
      {props.name}
      {/* <input
        key={props.id}
        checked={isEnabled}
        type="checkbox"
        onChange={(e) => toggleCoordinates(!isEnabled)}
      /> */}
    </li>
  );
}

export default function PolygonMaps(props) {
  let [postCodes, setPostCodes] = useState([]);
  let [selectedPostCodes, setSelectedPostCodes] = useState([]);

  const getLastIndexID = (selPostCodes) => {
    if (selPostCodes.length - 1 < 0) {
      return 0;
    } else {
      return selPostCodes[selPostCodes.length - 1]["properties"]["name"];
    }
  };
  const getSelectedPostCode = (selPostCodes) => {
    if (selPostCodes.length - 1 < 0) {
      return 0;
    } else {
      return selPostCodes[selPostCodes.length - 1]["coordinates"][
        Math.floor(
          selPostCodes[selPostCodes.length - 1]["coordinates"].length / 2
        )
      ];
    }
  };
  const getMiddleCoordinate = (arrCoordinate) => {
    return arrCoordinate[Math.floor(arrCoordinate.length / 2)];
  };

  useEffect(() => {
    console.log("getSelected", getSelectedPostCode(selectedPostCodes));
  }, [selectedPostCodes.length]);

  let apiRequestLoop = (arrReq) => {
    let promiseArray = [];
    for (let i = 0; i <= arrReq.length; i++) {
      let dataUrlLoop = process.env.REACT_BASE_URL + arrReq.name;
      promiseArray.push(
        fetch(dataUrlLoop)
          .then((res) => res.json())
          .then((data) => data.records)
      );
    }
    return Promise.all(promiseArray);
  };
  //   let coordinat
  useEffect(() => {
    fetch(process.env.REACT_BASE_URL)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPostCodes(data.records.map((record) => ({ ...record })));
      });
    if (postCodes.length > 0) {
      const promises = postCodes.map((postCode) =>
        axios.get(
          `${process.env.REACT_BASE_URL}${postCode.name}?maxRecords=1300`
        )
      );
      const promisesResolved = promises.map((promise) =>
        promise.catch((error) => ({ error }))
      );
      function checkFailed(then) {
        return function (responses) {
          const someFailed = responses.some((response) => response.error);
          if (someFailed) {
            throw responses;
          }
          return then(responses);
        };
      }
      axios
        .all(promisesResolved)
        .then(
          checkFailed(([someUrl, anotherUrl]) => {
            console.log("SUCCESS", someUrl, anotherUrl);
          })
        )
        .catch((arrErr) => {
          console.log("FAIL", arrErr);
          setSelectedPostCodes(
            arrErr
              .filter((res) => res.statusText === "OK")
              .map((res) => ({ ...res.data.postcode }))
          );
        });
    }
  }, [postCodes.length]);

  return (
    <div>
      <div className="App" style={{ minWidth: "100vw", minHeight: "100vh" }}>
        <Map
          key={getLastIndexID(selectedPostCodes)}
          selectedPostCodes={selectedPostCodes}
          defaultCoordinates={getSelectedPostCode(selectedPostCodes)}
        />
        <PostCodes>
          {postCodes.map((postCode) => (
            <PostCode
              {...postCode}
              selectedPostCodes={selectedPostCodes}
              setSelectedPostCodes={setSelectedPostCodes}
            />
          ))}
        </PostCodes>
      </div>
    </div>
  );
}
