import React, { useEffect, useState } from "react";
import Map from "./Map";
import PostCodes from "./PostCodes";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Grid,
  Image,
  Button,
  Header,
  Modal,
  Dimmer,
  Loader,
  Segment,
  Container,
  Sidebar,
  Menu,
  Icon,
  List,
} from "semantic-ui-react";

const VerticalSidebar = ({
  animation,
  direction,
  visible,
  enabledItems,
  disabledItems,
  setSelectedCoordinate,
}) => {
  function getMiddleCoordinate(itemCoordinates) {
    return itemCoordinates[Math.floor(itemCoordinates.length / 2)];
  }
  return (
    <Sidebar
      as={Menu}
      animation={animation}
      direction={direction}
      icon="labeled"
      inverted
      vertical
      visible={visible}
      width="thin"
    >
      {disabledItems.length > 0 && console.log("aaaa", disabledItems[0])}
      <List>
        {enabledItems.map((item) => (
          <List.Item
            onClick={() => {
              setSelectedCoordinate(getMiddleCoordinate(item.coordinates));
            }}
          >
            {item.properties.name}
          </List.Item>
        ))}
      </List>
    </Sidebar>
  );
};

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
        setPostCodes(data.postcode.map((record) => ({ ...record })));
      });
    fetch(process.env.REACT_APP_BASE_URL + "getAllKml")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setDisabledPostcodes(data.postcode.map((record) => ({ ...record })));
      });
    // if (postCodes.length > 0) {
    //   const promises = postCodes.map((postCode) =>
    //     axios.get(`${process.env.REACT_APP_BASE_URL}${postCode.name}`)
    //   );
    //   const promisesResolved = promises.map((promise) =>
    //     promise.catch((error) => ({ error }))
    //   );
    //   function checkFailed(then) {
    //     return function (responses) {
    //       const someFailed = responses.some((response) => response.error);
    //       if (someFailed) {
    //         throw responses;
    //       }
    //       return then(responses);
    //     };
    //   }
    //   axios
    //     .all(promisesResolved)
    //     .then(
    //       checkFailed(([someUrl, anotherUrl]) => {
    //         console.log("SUCCESS", someUrl, anotherUrl);
    //       })
    //     )
    //     .catch((arrErr) => {
    //       console.log("FAIL", arrErr);
    //       setSelectedPostCodes(
    //         arrErr
    //           .filter((res) => res.statusText === "OK")
    //           .map((res) => ({ ...res.data.postcode }))
    //       );
    //     });
    // }
  }, [postCodes.length]);
  console.log("disabledPostcodes", disabledPostcodes);
  // let modalContent = (properties) => {

  // }

  let [selectedPostCode, setSelectedPostCode] = useState({
    name: "",
    description: "",
  });
  let [selectedCoordinate, setSelectedCoordinate] = useState({
    lat: 51.47179,
    lng: -0.38309,
  });

  let [focusedPostcode, setFocusedPostcode] = useState(null);
  let [modalOpen, setModalOpen] = useState(false);

  let handleOpen = () => setModalOpen(true);

  let handleClose = () => setModalOpen(false);

  return (
    <Container fluid>
      <Modal
        dimmer="blurring"
        open={modalOpen}
        onClose={handleClose}
        size="mini"
      >
        <Modal.Content>
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
      <Sidebar.Pushable as={Segment}>
        <VerticalSidebar
          animation={"slide out"}
          direction={"left"}
          visible={true}
          enabledItems={postCodes.map((properties) => ({
            coordinates: properties.coordinates,
            properties: properties.properties,
          }))}
          setSelectedCoordinate={setSelectedCoordinate}
          disabledItems={disabledPostcodes.map((properties) => ({
            coordinates: properties.coordinates,
            properties: properties.properties,
          }))}
        />
        <Sidebar.Pusher>
          <Grid>
            <Grid.Column>
              {(() => {
                if (postCodes.length > 0 && disabledPostcodes.length > 0) {
                  return (
                    <Map
                      key={getLastIndexID(postCodes)}
                      selectedPostCodes={postCodes}
                      disabledPostcodes={disabledPostcodes}
                      setModalOpen={setModalOpen}
                      setSelectedPostCode={setPostCodes}
                      defaultCoordinates={selectedCoordinate}
                    />
                  );
                } else {
                  return (
                    <Segment basic>
                      <Loader active size="massive" dimmer />
                      <Map
                        key={getLastIndexID(postCodes)}
                        selectedPostCodes={[]}
                        disabledPostcodes={[]}
                        defaultCoordinates={selectedCoordinate}
                      />
                    </Segment>
                  );
                }
              })()}
            </Grid.Column>
          </Grid>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </Container>
  );
}
