import { useState } from "react";
import { cities } from "./data/locations";

/*
  Base map size.
  Numbers match the actual image size.
  Used to convert city x/y coordinates into percentages.
*/
const MAP_WIDTH = 1578;
const MAP_HEIGHT = 996;

/*
  City marker styling.
  Capital cities = gold diamond.
  Port cities = blue circle.
  Major cities = red circle.
  Selected cities = yellow glow.
*/
function getCityMarkerStyle(city, isSelected) {
  const isCapital = city.type === "Capital City";
  const isPort = city.isPort === true;

  const leftPosition = `${(city.x / MAP_WIDTH) * 100}%`;
  const topPosition = `${(city.y / MAP_HEIGHT) * 100}%`;

  let markerSize = "14px";
  let markerShape = "999px";
  let markerColor = "#8a0606";
  let markerTransform = "translate(-50%, -50%)";
  let markerShadow = "0 4px 10px rgba(0,0,0,0.3)";
  let markerZIndex = 10;

  if (isCapital) {
    markerSize = "16px";
    markerShape = "1px";
    markerColor = "#b48e10";
    markerTransform = "translate(-50%, -50%) rotate(45deg)";
    markerShadow =
      "0 0 0 3px rgba(212, 175, 55, 0.5), 0 4px 10px rgba(0,0,0,0.35)";
    markerZIndex = 13;
  }

  if (isPort) {
    markerSize = "14px";
    markerShape = "999px";
    markerColor = "#052f88";
    markerTransform = "translate(-50%, -50%)";
    markerShadow =
      "0 0 0 3px rgba(8, 145, 178, 0.35), 0 4px 10px rgba(0,0,0,0.35)";
    markerZIndex = 12;
  }

  if (isSelected) {
    markerColor = "#ffee00";
    markerShadow =
      "0 0 0 4px rgba(255, 196, 0, 0.75), 0 4px 10px rgba(0,0,0,0.3)";
  }

  return {
    position: "absolute",
    left: leftPosition,
    top: topPosition,

    width: markerSize,
    height: markerSize,

    borderRadius: markerShape,
    border: "1px solid black",

    backgroundColor: markerColor,
    transform: markerTransform,
    boxShadow: markerShadow,

    cursor: "pointer",
    zIndex: markerZIndex,
  };
}

/*
  Map key panel.
  Static currently.
  Explains what the map symbols mean.
  Later this can hold roads, trade routes, sea routes, borders, etc.
*/
function MapKey() {
  return (
    <aside
      style={{
        width: "500px",
        minWidth: "280px",
        backgroundColor: "#3d0f0f",
        color: "#cbd5e1",
        border: "0.5px solid #1a0206",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
      }}
    >
      <h2
        style={{
          fontSize: "28px",
          marginTop: 0,
        }}
      >
        Map Key
      </h2>

      <div
        style={{
          display: "grid",
          gap: "14px",
          fontSize: "15px",
        }}
      >
        {/* Capital city symbol */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span
            style={{
              width: "16px",
              height: "16px",
              backgroundColor: "#b48e10",
              border: "1px solid black",
              transform: "rotate(45deg)",
              boxShadow: "0 0 0 3px rgba(212, 175, 55, 0.5)",
              display: "inline-block",
            }}
          />

          <span>Capital City</span>
        </div>

        {/* Port city symbol */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span
            style={{
              width: "14px",
              height: "14px",
              backgroundColor: "#052f88",
              border: "1px solid black",
              borderRadius: "999px",
              boxShadow: "0 0 0 3px rgba(8, 145, 178, 0.35)",
              display: "inline-block",
            }}
          />

          <span>Port City</span>
        </div>

        {/* Major city symbol */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span
            style={{
              width: "14px",
              height: "14px",
              backgroundColor: "#8a0606",
              border: "1px solid black",
              borderRadius: "999px",
              display: "inline-block",
            }}
          />

          <span>Major City</span>
        </div>

        <hr
          style={{
            width: "100%",
            borderColor: "#cbd5e1",
          }}
        />

        <p
          style={{
            color: "#94a3b8",
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          Future key entries can include roads, trade routes, sea routes,
          regional borders, and landmarks.
        </p>
      </div>
    </aside>
  );
}

/*
  Main app.
  Holds the map.
  Holds the city panel.
  Holds the map key.
*/
export default function App() {
  /*
    Selected city.
    Starts empty.
    Fills when a city marker is clicked.
  */
  const [selectedCity, setSelectedCity] = useState(null);

  /*
    Last clicked map coordinate.
    Used for finding x/y positions.
    Can be helpful when placing new cities(for dev mostly).
  */
  const [lastClick, setLastClick] = useState(null);

  /*
    Map click handler.
    Reads where the user clicked.
    Converts screen position into map x/y coordinates.
    Logs the result for marker placement.
  */
  function handleMapClick(event) {
    const mapElement = event.currentTarget;
    const mapRectangle = mapElement.getBoundingClientRect();

    const clickX = event.clientX - mapRectangle.left;
    const clickY = event.clientY - mapRectangle.top;

    const mapX = Math.round((clickX / mapRectangle.width) * MAP_WIDTH);
    const mapY = Math.round((clickY / mapRectangle.height) * MAP_HEIGHT);

    setLastClick({
      x: mapX,
      y: mapY,
    });

    console.log(`x: ${mapX}, y: ${mapY}`);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#020617",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px",
        color: "white",
        overflow: "auto",
      }}
    >
      {/* Page wrapper */}
      <div
        style={{
          display: "block",
          gap: "12px",
          width: "100%",
          maxWidth: "2100px",
          transform: "scale(1)",
          transformOrigin: "center center",
        }}
      >
        {/* Map container */}
        <div
          onClick={handleMapClick}
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1578 / 996",
            overflow: "hidden",
            borderRadius: "16px",
            border: "1px solid #334155",
            boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
            backgroundColor: "#111827",
          }}
        >
          {/* Map image */}
          <img
            src="/Trioka-and-the-Grey.jpg"
            alt="Map of Trioka"
            draggable="false"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              userSelect: "none",
              pointerEvents: "none",
            }}
          />

          {/* Coordinate display */}
          {lastClick && (
            <div
              style={{
                position: "absolute",
                left: "12px",
                top: "12px",
                zIndex: 20,
                backgroundColor: "rgba(0,0,0,0.8)",
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            >
              x: {lastClick.x}, y: {lastClick.y}
            </div>
          )}

          {/* City markers */}
          {cities.map((city) => {
            const isSelected = selectedCity?.id === city.id;

            return (
              <button
                key={city.id}
                title={city.name}
                style={getCityMarkerStyle(city, isSelected)}
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedCity(city);
                }}
              />
            );
          })}
        </div>

        {/* Bottom panels */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            width: "100%",
            marginTop: "12px",
            alignItems: "stretch",
            justifyContent: "space-between",
          }}
        >
          {/* City information panel */}
          <aside
            style={{
              width: "500px",
              minWidth: "280px",
              backgroundColor: "#3d0f0f",
              border: "0.5px solid #1a0206",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
            }}
          >
            {selectedCity ? (
              <>
                {/* City type */}
                <p
                  style={{
                    color: "#fcd34d",
                    fontSize: "14px",
                    margin: 0,
                  }}
                >
                  {selectedCity.type}
                </p>

                {/* City name */}
                <h2
                  style={{
                    fontSize: "28px",
                    marginTop: "8px",
                  }}
                >
                  {selectedCity.name}
                </h2>

                {/* City image */}
                {selectedCity.portraits && (
                  <img
                    src={selectedCity.portraits}
                    alt={`${selectedCity.name} portraits`}
                    style={{
                      width: "100%",
                      height: "300px",
                      objectFit: "contain",
                      borderRadius: "6px",
                      border: "1px solid #3b0b0b",
                      marginTop: "12px",
                      marginBottom: "12px",
                    }}
                  />
                )}

                {/* City description */}
                <p
                  style={{
                    color: "#cbd5e1",
                    lineHeight: 1.6,
                  }}
                >
                  {selectedCity.description}
                </p>
              </>
            ) : (
              <>
                {/* Default panel */}
                <h2
                  style={{
                    fontSize: "28px",
                    marginTop: 0,
                  }}
                >
                  Trioka Map
                </h2>

                <p
                  style={{
                    color: "#cbd5e1",
                    lineHeight: 1.6,
                  }}
                >
                  Click a city marker to view its information.
                </p>

                <p
                  style={{
                    color: "#94a3b8",
                    fontSize: "14px",
                    lineHeight: 1.6,
                  }}
                >
                  Click empty areas of the map to show x/y coordinates for
                  placing new markers.
                </p>
              </>
            )}
          </aside>

          {/* Static map key */}
          <MapKey />
        </div>
      </div>
    </main>
  );
}