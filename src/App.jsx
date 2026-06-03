import { useEffect, useRef, useState } from "react";
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
    transform: "translate(-50%, -50%)",
    padding: 0,
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    zIndex: markerZIndex,
  };
}

/*
  City icon selection.
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
  City icon filter type.
  Used by the checklist to show or hide city marker groups.
*/
function getCityIconFilterType(city) {
  const isCapital = city.type === "Capital City";
  const isPort = city.isPort === true;
  const isCapitalPort = isCapital && isPort;

  if (isCapitalPort) {
    return "capital-port";
  }

  if (isCapital) {
    return "capital";
  }

  if (isPort) {
    return "port";
  }

  return "major-city";
}

/*
  Map key item.
  Also works as a city icon toggle.
*/
function MapKeyItem({ icon, label, checked, onChange }) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        cursor: "pointer",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{
          cursor: "pointer",
          accentColor: "#fcd34d",
        }}
      />

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
    </label>
  );
}

/*
  Route key item.
  Also works as a route toggle.
*/
function RouteKeyItem({ color, dashArray, label, checked, onChange }) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        cursor: "pointer",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{
          cursor: "pointer",
          accentColor: "#fcd34d",
        }}
      />

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
    </label>
  );
}

/*
  Map key panel.
  The routeFilters and setRouteFilters values are passed in from App.
  The cityIconFilters and setCityIconFilters values are also passed in from App.

  The map key now acts as both:
  1. A symbol explanation.
  2. A checklist for showing and hiding map layers.
*/
function MapKey({
  routeFilters,
  setRouteFilters,
  cityIconFilters,
  setCityIconFilters,
}) {
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
        <MapKeyItem
          icon="/icons/capitalport.svg"
          label="Capital Port City"
          checked={cityIconFilters["capital-port"]}
          onChange={() =>
            setCityIconFilters((previousFilters) => ({
              ...previousFilters,
              "capital-port": !previousFilters["capital-port"],
            }))
          }
        />

        <MapKeyItem
          icon="/icons/capital.svg"
          label="Capital City"
          checked={cityIconFilters["capital"]}
          onChange={() =>
            setCityIconFilters((previousFilters) => ({
              ...previousFilters,
              "capital": !previousFilters["capital"],
            }))
          }
        />

        <MapKeyItem
          icon="/icons/port.svg"
          label="Port City"
          checked={cityIconFilters["port"]}
          onChange={() =>
            setCityIconFilters((previousFilters) => ({
              ...previousFilters,
              "port": !previousFilters["port"],
            }))
          }
        />

        <MapKeyItem
          icon="/icons/majorcity.svg"
          label="Major City"
          checked={cityIconFilters["major-city"]}
          onChange={() =>
            setCityIconFilters((previousFilters) => ({
              ...previousFilters,
              "major-city": !previousFilters["major-city"],
            }))
          }
        />

        <RouteKeyItem
          color="#d97706"
          dashArray="4 4"
          label="Trade Road"
          checked={routeFilters["trade-road"]}
          onChange={() =>
            setRouteFilters((previousFilters) => ({
              ...previousFilters,
              "trade-road": !previousFilters["trade-road"],
            }))
          }
        />

        <RouteKeyItem
          color="#2563eb"
          dashArray="10 8"
          label="Sea Route"
          checked={routeFilters["sea-route"]}
          onChange={() =>
            setRouteFilters((previousFilters) => ({
              ...previousFilters,
              "sea-route": !previousFilters["sea-route"],
            }))
          }
        />

        <RouteKeyItem
          color="#9ca3af"
          dashArray="none"
          label="Road"
          checked={routeFilters["road"]}
          onChange={() =>
            setRouteFilters((previousFilters) => ({
              ...previousFilters,
              "road": !previousFilters["road"],
            }))
          }
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
          Check or uncheck map key items to show or hide city icons and selected
          city routes.
        </p>
      </div>
    </aside>
  );
}

/*
  Main app.
*/
export default function App() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [lastClick, setLastClick] = useState(null);
  const [musicPlaying, setMusicPlaying] = useState(false);

  const [routeFilters, setRouteFilters] = useState({
    "road": true,
    "trade-road": true,
    "sea-route": true,
  });

  const [cityIconFilters, setCityIconFilters] = useState({
    "capital-port": true,
    "capital": true,
    "port": true,
    "major-city": true,
  });

  const musicRef = useRef(null);
  const cityClickSoundRef = useRef(null);

  /*
    Try to start the map music when the page loads.
    Some browsers will block this until the user clicks.
  */
  useEffect(() => {
    if (!musicRef.current) return;

    musicRef.current.volume = 0.1;
    musicRef.current.loop = true;

    musicRef.current
      .play()
      .then(() => {
        setMusicPlaying(true);
      })
      .catch(() => {
        console.log("Autoplay was blocked. User must click Play Map Music.");
        setMusicPlaying(false);
      });
  }, []);

  /*
    Map click handler.
    Reads where the user clicked.
    Converts screen position into map x/y coordinates.

    This also clears the selected city.
    City marker clicks use event.stopPropagation(), so clicking a city will not
    trigger this empty-map click behavior.
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

    setSelectedCity(null);

    console.log(`x: ${mapX}, y: ${mapY}`);
  }

  /*
    Plays the city click sound whenever a city marker is clicked.
  */
  function playCityClickSound() {
    if (!cityClickSoundRef.current) return;

    cityClickSoundRef.current.currentTime = 0;
    cityClickSoundRef.current.volume = 0.3;

    cityClickSoundRef.current.play().catch(() => {
      console.log("City click sound was blocked until user interaction.");
    });
  }

  /*
    Starts or pauses the background map music.
  */
  function toggleMusic() {
    if (!musicRef.current) return;

    if (musicPlaying) {
      musicRef.current.pause();
      setMusicPlaying(false);
    } else {
      musicRef.current.volume = 0.1;
      musicRef.current.loop = true;

      musicRef.current
        .play()
        .then(() => {
          setMusicPlaying(true);
        })
        .catch(() => {
          console.log("Music playback was blocked until user interaction.");
        });
    }
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
      {/* Audio files */}
      <audio ref={musicRef} src="/audio/Menumusic.mp3" preload="auto" />
      <audio
        ref={cityClickSoundRef}
        src="/audio/fireclickshort.mp3"
        preload="auto"
      />

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
            routeFilters={routeFilters}
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
          {cities
            .filter((city) => {
              const cityIconFilterType = getCityIconFilterType(city);

              return cityIconFilters[cityIconFilterType] === true;
            })
            .map((city) => {
              const isSelected = selectedCity?.id === city.id;

              return (
                <button
                  key={city.id}
                  title={city.name}
                  style={getCityMarkerStyle(city)}
                  onClick={(event) => {
                    event.stopPropagation();
                    playCityClickSound();
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
                      transform: isSelected ? "scale(1.35)" : "scale(1)",
                      filter: isSelected
                        ? "drop-shadow(0 0 4px rgba(255, 255, 180, 1)) drop-shadow(0 0 9px rgba(255, 196, 0, 1)) drop-shadow(0 0 16px rgba(255, 115, 0, 0.95)) drop-shadow(0 0 24px rgba(255, 60, 0, 0.75))"
                        : "drop-shadow(0 3px 4px rgba(17, 59, 19, 0.60))",
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
            {/* Music button */}
            <button
              onClick={toggleMusic}
              style={{
                backgroundColor: musicPlaying ? "#b48e10" : "#111827",
                color: "white",
                border: "1px solid #fcd34d",
                borderRadius: "8px",
                padding: "8px 12px",
                cursor: "pointer",
                marginBottom: "16px",
                fontWeight: "bold",
              }}
            >
              {musicPlaying ? "Pause Map Music" : "Start Map Music"}
            </button>

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
          <MapKey
            routeFilters={routeFilters}
            setRouteFilters={setRouteFilters}
            cityIconFilters={cityIconFilters}
            setCityIconFilters={setCityIconFilters}
          />
        </div>
      </div>
    </main>
  );
}