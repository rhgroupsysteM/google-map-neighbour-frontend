import React, { Component } from "react";
// import GoogleMapReact, { Polygon } from "google-map-react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Polygon,
  Marker,
  KmlLayer,
} from "react-google-maps";
import test from "./kml/test";
import test2 from "./kml/test2";
import * as kmlFile from "./kml/CR.kml";
// const AnyReactComponent = ({ text }) => <div>{text}</div>;

const coords = [
  { lat: 29.047487, lng: 41.023164 },
  { lat: 29.0459633, lng: 41.0212904 },
  { lat: 29.0449333, lng: 41.0167573 },
  { lat: 29.0393543, lng: 41.0106695 },
  { lat: 29.032917, lng: 41.0049697 },
  { lat: 29.0226173, lng: 41.0061356 },
  { lat: 29.0078545, lng: 41.0039334 },
  { lat: 29.0201283, lng: 40.9765933 },
  { lat: 29.0319729, lng: 40.9657708 },
  { lat: 29.0784073, lng: 40.9536501 },
  { lat: 29.0944576, lng: 40.9493068 },
  { lat: 29.0975475, lng: 40.9514461 },
  { lat: 29.1052294, lng: 40.9647986 },
  { lat: 29.097338, lng: 40.978242 },
  { lat: 29.0931273, lng: 40.9835914 },
  { lat: 29.0858746, lng: 40.987738 },
  { lat: 29.056509, lng: 40.998902 },
  { lat: 29.061456, lng: 41.008443 },
  { lat: 29.0617561, lng: 41.0104752 },
  { lat: 29.0595245, lng: 41.0126772 },
  { lat: 29.052014, lng: 41.018198 },
  { lat: 29.047487, lng: 41.023164 },
];
// -0.03566,51.35469
const MapWithAMarker = withScriptjs(
  withGoogleMap((props) => (
    <GoogleMap
      key={props.key}
      defaultZoom={11}
      // defaultCenter={{
      //   lat: 51.47179,
      //   lng: -0.38309,
      // }}
      defaultCenter={
        props.defaultCoordinates
          ? props.defaultCoordinates
          : { lat: 51.47179, lng: -0.38309 }
      }
    >
      {props.selectedPostCodes.length > 0 &&
        props.selectedPostCodes.map((postCode) => (
          <Polygon
            // key={postCode.properties.name}
            paths={postCode.coordinates}
            options={{
              fillColor: "#66ff66",
              fillOpacity: 0.4,
              strokeColor: "#66ff66",
              strokeOpacity: 1,
              strokeWeight: 1,
            }}
            onClick={(e) => {
              console.log("click polygon", postCode.properties);
              props.setSelectedPostCode(postCode.properties);
              props.setModalOpen(true);
            }}
          />
        ))}
      {props.disabledPostcodes.length > 0 &&
        props.disabledPostcodes.map((postCode) => (
          <Polygon
            path={postCode.coordinates}
            options={{
              fillColor: "#f02137",
              fillOpacity: 0.4,
              strokeColor: "#f02137",
              strokeOpacity: 1,
              strokeWeight: 1,
            }}
            onClick={(e) => {
              console.log("click polygon", postCode.properties);
              props.setSelectedPostCode(postCode.properties);
              props.setModalOpen(true);
            }}
          />
        ))}
      {/* <KmlLayer
        url="https://github.com/missinglink/uk-postcode-polygons/blob/master/kml/AB.kml"
        options={{ preserveViewport: true }}
      /> */}
    </GoogleMap>
  ))
);

const SimpleMap = ({
  selectedPostCodes,
  key,
  defaultCoordinates,
  disabledPostcodes,
  setModalOpen,
  setSelectedPostCode,
}) => (
  <MapWithAMarker
    key={key}
    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBPUiSGYIljWpEJ0iUAJbusbdPly-U4Z6Y&v=3.exp&libraries=geometry,drawing,places"
    loadingElement={<div style={{ height: `100%` }} />}
    containerElement={<div style={{ height: `100vh` }} />}
    mapElement={<div style={{ height: `100%` }} />}
    selectedPostCodes={selectedPostCodes.map((properties) => ({
      coordinates: properties.coordinates,
      properties: properties.properties,
    }))}
    disabledPostcodes={disabledPostcodes.map((postCode) => ({
      coordinates: postCode.coordinates,
      properties: postCode.properties,
    }))}
    defaultCoordinates={defaultCoordinates}
    setModalOpen={setModalOpen}
    setSelectedPostCode={setSelectedPostCode}
  />
);
//AIzaSyBPUiSGYIljWpEJ0iUAJbusbdPly-U4Z6Y

export default SimpleMap;
