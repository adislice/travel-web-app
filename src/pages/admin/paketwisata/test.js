import React, { useCallback, useEffect, useRef, useState } from 'react'
import { TimepickerUI } from 'timepicker-ui';
import { Wrapper, Status } from "@googlemaps/react-wrapper";

const render = (status) => {
  if (status === Status.LOADING) return <h3>{status} ..</h3>;
  if (status === Status.FAILURE) return <h3>{status} ...</h3>;
  return null;
};

function MyMapComponent({
  center,
  zoom,
}) {
  const ref = useRef();

  useEffect(() => {
    new window.google.maps.Map(ref.current, {
      center,
      zoom,
    });
  });

  return <div ref={ref} id="map" />;
}

function TestTime() {
  const center = { lat: -34.397, lng: 150.644 };
  const zoom = 4;

  return (
    <Wrapper apiKey="AIzaSyAr4xlzzVJARvrYjj-qE00fNqMv4D-LY-U" render={render}>
      <MyMapComponent center={center} zoom={zoom} />
    </Wrapper>
  )
}

export default TestTime