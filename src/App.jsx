import { useState } from "react";
import { cities } from "./data/locations";
import RouteLayer from "./components/RouteLayer";
import { routes } from "./data/routes";

/*
  Base map size.
  Numbers match the actual image size.
  Used to convert city x/y coordinates into percentages.
*/
const MAP_WIDTH = 1578;
const MAP_HEIGHT = 996;

/*
  City marker styling.
  Controls marker position, size, and click area.
  Icon image controls the actual symbol appearance.
  Selected cities get a larger glow from the image filter.
*/
function getCityMarkerStyle(city) {
  const isCapital = city.type === "Capital City";
  const isPort = city.isPort === true;
  const isCapitalPort = isCapital && isPort;

  const leftPosition = `${(city.x / MAP_WIDTH) * 100}%`;
  const topPosition = `${(city.y / MAP_HEIGHT) * 100}%`;

  let markerSize = "16px";
  let markerZIndex = 10;

  /*
    Capital port cities use the same size as capital cities.
    They get the highest z-index because they are the most important symbol.
  */
  if (isCapitalPort) {
    markerSize = "20px";
    markerZIndex = 14;
  } else if (isCapital) {
    markerSize = "20px";
    markerZIndex = 13;
  } else if (isPort) {
    markerSize = "18px";
    markerZIndex = 12;
  }

  return {
    position: "absolute",
    left: leftPosition,
    top: topPosition,

    width: markerSize,
    height: markerSize,

    /*
      Center marker on its x/y coordinate.
      Do not rotate here.
      The SVG file itself should control the symbol shape.
    */
    transform: "translate(-50%, -50%)",

    /*
      Remove default button styling.
      Keeps only the icon image visible.
    */
    padding: 0,
    border: "none",
    backgroundColor: "transparent",

    cursor: "pointer",
    zIndex: markerZIndex,
  };
}

/*
  City icon selection.
  Capital ports are checked first.
  This lets capital port symbols override normal capital and port symbols.
*/
function getCityIcon(city) {
  const isCapital = city.type === "Capital City";
  const isPort = city.isPort === true;

  if (isCapital && isPort) {
    return "/icons/capitalport.svg";
  }

  if (isCapital) {
    return "/icons/capital.svg";
  }

  if (isPort) {
    return "/icons/port.svg";
  }

  return "/icons/majorcity.svg";
}

/*
  Map key item.
  Keeps each icon row consistent.
  Used by the static map key panel.
*/
function MapKeyItem({ icon, label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <img
        src={icon}
        alt=""
        draggable="false"
        style={{
          width: "22px",
          height: "22px",
          objectFit: "contain",
          userSelect: "none",
          pointerEvents: "none",
          filter: "drop-shadow(0 3px 4px rgba(0, 0, 0, 0.65))",
        }}
      />

      <span>{label}</span>
    </div>
  );
}

/*
  Route key item.
  Shows a small sample line for roads, trade roads, and sea routes.
  Used by the static map key panel.
*/
function RouteKeyItem({ color, dashArray, label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <svg
        width="32"
        height="18"
        viewBox="0 0 32 18"
        style={{
          flexShrink: 0,
          overflow: "visible",
        }}
      >
        <path
          d="M 2 9 L 30 9"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={dashArray}
          style={{
            filter: "drop-shadow(0 0 4px rgba(255, 255, 255, 0.35))",
          }}
        />
      </svg>

      <span>{label}</span>
    </div>
  );
}

/*
  Map key panel.
  Static currently.
  Explains what the map symbols mean.
  Later this can hold borders, landmarks, and other map symbols.
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
        {/* Capital port city symbol */}
        <MapKeyItem
          icon="/icons/capitalport.svg"
          label="Capital Port City"
        />

        {/* Capital city symbol */}
        <MapKeyItem
          icon="/icons/capital.svg"
          label="Capital City"
        />

        {/* Port city symbol */}
        <MapKeyItem
          icon="/icons/port.svg"
          label="Port City"
        />

        {/* Major city symbol */}
        <MapKeyItem
          icon="/icons/majorcity.svg"
          label="Major City"
        />

        {/* Trade road symbol */}
        <RouteKeyItem
          color="#d97706"
          dashArray="4 4"
          label="Trade Road"
        />

        {/* Sea route symbol */}
        <RouteKeyItem
          color="#2563eb"
          dashArray="10 8"
          label="Sea Route"
        />

        {/* Standard road symbol */}
        <RouteKeyItem
          color="#9ca3af"
          dashArray="none"
          label="Road"
        />

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
          Roads, trade roads, and sea routes appear when a connected city is
          selected.
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

          {/* Road, trade route, and sea route layer */}
          <RouteLayer
            routes={routes}
            selectedCity={selectedCity}
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
                style={getCityMarkerStyle(city)}
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedCity(city);
                }}
              >
                <img
                  src={getCityIcon(city)}
                  alt=""
                  draggable="false"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    pointerEvents: "none",
                    userSelect: "none",
                    transition: "filter 160ms ease, transform 160ms ease",
                    transform: isSelected ? "scale(1.25)" : "scale(1)",
                    filter: isSelected
                      ? "drop-shadow(0 0 6px rgba(255, 238, 0, 0.95)) drop-shadow(0 0 12px rgba(255, 196, 0, 0.9))"
                      : "drop-shadow(0 3px 4px rgba(0, 0, 0, 0.65))",
                  }}
                />
              </button>
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