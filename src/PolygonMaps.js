import React, { useEffect, useState } from "react";
import Map from "./Map";
import PostCodes from "./PostCodes";
import { Link } from "react-router-dom";
import axios from "axios";
import { Grid, Image, Button, Header, Modal } from "semantic-ui-react";

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
  return <li key={props.id}>{props.name}</li>;
}

export default function PolygonMaps(props) {
  let [postCodes, setPostCodes] = useState([]);
  let [selectedPostCodes, setSelectedPostCodes] = useState([]);

  let [disabledPostcodes, setDisabledPostcodes] = useState([]);

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
  useEffect(() => {
    console.log("PROCEEESSS", process.env.REACT_APP_BASE_URL);
    fetch(process.env.REACT_APP_BASE_URL + "all")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPostCodes(data.records.map((record) => ({ ...record })));
      });
    fetch(process.env.REACT_APP_BASE_URL + "getAllKml")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setDisabledPostcodes(data.postcode.map((record) => ({ ...record })));
      });
    if (postCodes.length > 0) {
      const promises = postCodes.map((postCode) =>
        axios.get(`${process.env.REACT_APP_BASE_URL}${postCode.name}`)
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
  console.log("disabledPostcodes", disabledPostcodes);
  // let modalContent = (properties) => {

  // }

  let [selectedPostCode, setSelectedPostCode] = useState({
    name: "",
    description: "",
  });
  let [modalOpen, setModalOpen] = useState(false);

  let handleOpen = () => setModalOpen(true);

  let handleClose = () => setModalOpen(false);

  return (
    <div>
      <Modal
        dimmer="blurring"
        // trigger={<Button onClick={handleOpen}>Show Modal</Button>}
        open={modalOpen}
        onClose={handleClose}
        size="mini"
      >
        {/* <Header icon="browser" /> */}
        <Modal.Content>
          {/* <Image wrapped size="medium" src="/images/avatar/large/rachel.png" /> */}
          <Modal.Description>
            <Header>{selectedPostCode.name}</Header>
            <p>{selectedPostCode.description}</p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" onClick={handleClose} inverted>
            Okay
          </Button>
        </Modal.Actions>
      </Modal>
      <div className="App" style={{ minWidth: "100vw", minHeight: "100vh" }}>
        <Grid>
          <Grid.Column>
            {(() => {
              if (postCodes.length > 0 && disabledPostcodes.length > 0) {
                return (
                  <Map
                    key={getLastIndexID(selectedPostCodes)}
                    selectedPostCodes={selectedPostCodes}
                    disabledPostcodes={disabledPostcodes}
                    setModalOpen={setModalOpen}
                    setSelectedPostCode={setSelectedPostCode}
                    defaultCoordinates={getSelectedPostCode(selectedPostCodes)}
                  />
                );
              } else {
                return (
                  <Map
                    key={getLastIndexID(selectedPostCodes)}
                    selectedPostCodes={[]}
                    disabledPostcodes={[]}
                    defaultCoordinates={getSelectedPostCode(selectedPostCodes)}
                  />
                );
              }
            })()}
          </Grid.Column>
        </Grid>
        {/* <PostCodes>
          {postCodes.map((postCode) => (
            <PostCode
              {...postCode}
              selectedPostCodes={selectedPostCodes}
              setSelectedPostCodes={setSelectedPostCodes}
            />
          ))}
        </PostCodes> */}
      </div>
    </div>
  );
}
