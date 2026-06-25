import { useEffect, useRef, useState } from "react";
import RouteLayer from "./components/RouteLayer";
import Login from "./components/Login";

import cities from "./data/cities.json";
import routes from "./data/routes.json";
import factions from "./data/factions.json";
import regions from "./data/regions.json";
import atlasConfig from "./data/AtlasConfig.json";

/*
  Trioka Atlas

  JSON controls:
  - Map image
  - Map size
  - Audio
  - Icons
  - City data
  - Route data
  - Faction data
  - Region data
*/

const MAP_WIDTH = atlasConfig.map.width;
const MAP_HEIGHT = atlasConfig.map.height;

/*
  Loads the saved login user from localStorage.
  Local key used inside Login.jsx.
*/
function getSavedUser() {
  try {
    const savedUser = localStorage.getItem("triokaUser");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
}

/*
  Default checked/unchecked state for filters.

  Example:
  [
    { id: "road", defaultVisible: true },
    { id: "sea-route", defaultVisible: true }
  ]

  Becomes:
  {
    "road": true,
    "sea-route": true
  }
*/
function buildDefaultFilters(items, fallbackDefault = true) {
  if (!Array.isArray(items)) {
    return {};
  }

  return items.reduce((filters, item) => {
    filters[item.id] = item.defaultVisible ?? fallbackDefault;
    return filters;
  }, {});
}

/*
  Safely turns a single value or array into an array.

  Example:
  "sundrin-empire" becomes ["sundrin-empire"]

  Example:
  ["sundrin-empire", "kingdom-of-lyth"] stays the same
*/
function valueToArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

/*
  Removes repeated values from an array.
*/
function uniqueArray(values) {
  return [...new Set(values.filter(Boolean))];
}

/*
  City icon filter type.

  New method:
  - Prefer city.markerType from cities.json.

  Fallback method:
  - If markerType is missing, use old logic from type/isPort.
*/
function getCityIconFilterType(city) {
  if (city.markerType) {
    return city.markerType;
  }

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
  Gets the city icon config from AtlasConfig.json.
*/
function getCityIconConfig(city) {
  const markerType = getCityIconFilterType(city);

  return (
    atlasConfig.cityIconTypes.find((iconType) => iconType.id === markerType) ||
    atlasConfig.cityIconTypes.find((iconType) => iconType.id === "major-city")
  );
}

/*
  City marker styling.
  Marker size and z-index now come from AtlasConfig.json.
*/
function getCityMarkerStyle(city) {
  const cityX = city.x ?? city.coordinates?.x ?? 0;
  const cityY = city.y ?? city.coordinates?.y ?? 0;

  const leftPosition = `${(cityX / MAP_WIDTH) * 100}%`;
  const topPosition = `${(cityY / MAP_HEIGHT) * 100}%`;

  const iconConfig = getCityIconConfig(city);

  const markerSize = iconConfig?.size ?? "16px";
  const markerZIndex = iconConfig?.zIndex ?? 10;

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
  Icon path now comes from AtlasConfig.json.
*/
function getCityIcon(city) {
  const iconConfig = getCityIconConfig(city);

  return iconConfig?.icon ?? "/icons/majorcity.svg";
}

/*
  Gets faction ids from a city.

  Preferred JSON format:
  "factionId": "sundrin-empire"

  Also supports:
  "factionIds": ["sundrin-empire"]
*/
function getCityFactionIds(city) {
  const ids = [
    ...valueToArray(city.factionId),
    ...valueToArray(city.factionIds),
  ];

  /*
    Optional fallback:
    If a city uses "faction": "Sundrin Empire",
    this tries to match it to factions.json.
  */
  if (city.faction) {
    const matchingFaction = factions.find(
      (faction) =>
        faction.name.toLowerCase() === String(city.faction).toLowerCase()
    );

    if (matchingFaction) {
      ids.push(matchingFaction.id);
    }
  }

  return uniqueArray(ids);
}

/*
  Gets region ids from a city.

  Preferred JSON format:
  "regionId": "ulden"

  Also supports:
  "regionIds": ["ulden"]
*/
function getCityRegionIds(city) {
  const ids = [
    ...valueToArray(city.regionId),
    ...valueToArray(city.regionIds),
  ];

  /*
    Optional fallback:
    If a city uses "region": "Ulden",
    this tries to match it to regions.json.
  */
  if (city.region) {
    const matchingRegion = regions.find(
      (region) =>
        region.name.toLowerCase() === String(city.region).toLowerCase()
    );

    if (matchingRegion) {
      ids.push(matchingRegion.id);
    }
  }

  return uniqueArray(ids);
}

/*
  Gets a readable faction name for the city info panel.
*/
function getCityFactionName(city) {
  if (city.faction) {
    return city.faction;
  }

  const factionId = getCityFactionIds(city)[0];

  if (!factionId) {
    return null;
  }

  const faction = factions.find((item) => item.id === factionId);

  return faction?.name ?? null;
}

/*
  Gets a readable region name for the city info panel.
*/
function getCityRegionName(city) {
  if (city.region) {
    return city.region;
  }

  const regionId = getCityRegionIds(city)[0];

  if (!regionId) {
    return null;
  }

  const region = regions.find((item) => item.id === regionId);

  return region?.name ?? null;
}

/*
  Gets the first selected color from a list of ids.
*/
function getSelectedEntityColor(ids, filters, items) {
  const selectedId = ids.find((id) => filters[id] === true);

  if (!selectedId) {
    return null;
  }

  const selectedItem = items.find((item) => item.id === selectedId);

  return selectedItem?.color ?? "#fcd34d";
}

/*
  City highlight color.

  Factions take priority over regions if both are enabled.
*/
function getCityHighlightColor(
  city,
  atlasLayerFilters,
  factionFilters,
  regionFilters
) {
  if (atlasLayerFilters.factions) {
    const factionColor = getSelectedEntityColor(
      getCityFactionIds(city),
      factionFilters,
      factions
    );

    if (factionColor) {
      return factionColor;
    }
  }

  if (atlasLayerFilters.regions) {
    const regionColor = getSelectedEntityColor(
      getCityRegionIds(city),
      regionFilters,
      regions
    );

    if (regionColor) {
      return regionColor;
    }
  }

  return null;
}

/*
  City marker visual filter.

  Selected city keeps the original gold glow.
  Faction/region highlighted cities get their faction/region color glow.
*/
function getCityMarkerFilter(isSelected, highlightColor) {
  if (isSelected) {
    return "drop-shadow(0 0 4px rgba(255, 255, 180, 1)) drop-shadow(0 0 9px rgba(255, 196, 0, 1)) drop-shadow(0 0 16px rgba(255, 115, 0, 0.95)) drop-shadow(0 0 24px rgba(255, 60, 0, 0.75))";
  }

  if (highlightColor) {
    return `drop-shadow(0 0 5px ${highlightColor}) drop-shadow(0 0 12px ${highlightColor}) drop-shadow(0 0 20px ${highlightColor})`;
  }

  return "drop-shadow(0 3px 4px rgba(17, 59, 19, 0.60))";
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
          strokeDasharray={dashArray === "none" ? undefined : dashArray}
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
  Simple checkbox row for Atlas Layers.
*/
function CheckboxTextItem({ label, checked, onChange }) {
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

      <span>{label}</span>
    </label>
  );
}

/*
  Checkbox row with a color swatch.
  Used for individual faction and region options.
*/
function ColorCheckboxItem({ color, label, checked, onChange }) {
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

      <span
        style={{
          width: "18px",
          height: "18px",
          borderRadius: "5px",
          backgroundColor: color,
          border: "1px solid rgba(255,255,255,0.45)",
          boxShadow: `0 0 8px ${color}`,
          flexShrink: 0,
        }}
      />

      <span>{label}</span>
    </label>
  );
}

/*
  Map key panel.

  Column 1:
  - City marker toggles
  - Route type toggles

  Column 2:
  - Factions master toggle
  - Regions master toggle

  Column 3:
  - Only appears when Factions or Regions are turned on
  - Individual faction/region options default off
*/
function MapKey({
  routeFilters,
  setRouteFilters,
  cityIconFilters,
  setCityIconFilters,
  atlasLayerFilters,
  setAtlasLayerFilters,
  factionFilters,
  setFactionFilters,
  regionFilters,
  setRegionFilters,
}) {
  const showLayerOptions =
    atlasLayerFilters.factions || atlasLayerFilters.regions;

  return (
    <aside
      style={{
        flex: 1,
        minWidth: showLayerOptions ? "760px" : "500px",
        backgroundColor: "#3d0f0f",
        color: "#cbd5e1",
        border: "0.5px solid #1a0206",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: showLayerOptions ? "1fr 1fr 1.2fr" : "1fr 1fr",
          gap: "28px",
          alignItems: "start",
        }}
      >
        {/* Column 1 */}
        <section>
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
            {atlasConfig.cityIconTypes.map((iconType) => (
              <MapKeyItem
                key={iconType.id}
                icon={iconType.icon}
                label={iconType.label}
                checked={cityIconFilters[iconType.id] === true}
                onChange={() =>
                  setCityIconFilters((previousFilters) => ({
                    ...previousFilters,
                    [iconType.id]: !previousFilters[iconType.id],
                  }))
                }
              />
            ))}

            {atlasConfig.routeTypes.map((routeType) => (
              <RouteKeyItem
                key={routeType.id}
                color={routeType.color}
                dashArray={routeType.dashArray ?? "none"}
                label={routeType.label}
                checked={routeFilters[routeType.id] === true}
                onChange={() =>
                  setRouteFilters((previousFilters) => ({
                    ...previousFilters,
                    [routeType.id]: !previousFilters[routeType.id],
                  }))
                }
              />
            ))}

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
              Check or uncheck map key items to show or hide city icons and
              selected city routes.
            </p>
          </div>
        </section>

        {/* Column 2 */}
        <section>
          <h2
            style={{
              fontSize: "28px",
              marginTop: 0,
            }}
          >
            Atlas Layers
          </h2>

          <div
            style={{
              display: "grid",
              gap: "14px",
              fontSize: "15px",
            }}
          >
            <CheckboxTextItem
              label="Factions"
              checked={atlasLayerFilters.factions === true}
              onChange={() =>
                setAtlasLayerFilters((previousFilters) => ({
                  ...previousFilters,
                  factions: !previousFilters.factions,
                }))
              }
            />

            <CheckboxTextItem
              label="Regions"
              checked={atlasLayerFilters.regions === true}
              onChange={() =>
                setAtlasLayerFilters((previousFilters) => ({
                  ...previousFilters,
                  regions: !previousFilters.regions,
                }))
              }
            />

            <p
              style={{
                color: "#94a3b8",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              Turn on a layer to reveal its individual options.
            </p>
          </div>
        </section>

        {/* Column 3 */}
        {showLayerOptions && (
          <section>
            <h2
              style={{
                fontSize: "28px",
                marginTop: 0,
              }}
            >
              Layer Options
            </h2>

            <div
              style={{
                display: "grid",
                gap: "18px",
                fontSize: "15px",
              }}
            >
              {atlasLayerFilters.factions && (
                <div>
                  <h3
                    style={{
                      color: "#fcd34d",
                      fontSize: "18px",
                      marginTop: 0,
                      marginBottom: "12px",
                    }}
                  >
                    Factions
                  </h3>

                  <div
                    style={{
                      display: "grid",
                      gap: "10px",
                    }}
                  >
                    {factions.map((faction) => (
                      <ColorCheckboxItem
                        key={faction.id}
                        color={faction.color}
                        label={faction.name}
                        checked={factionFilters[faction.id] === true}
                        onChange={() =>
                          setFactionFilters((previousFilters) => ({
                            ...previousFilters,
                            [faction.id]: !previousFilters[faction.id],
                          }))
                        }
                      />
                    ))}
                  </div>
                </div>
              )}

              {atlasLayerFilters.regions && (
                <div>
                  <h3
                    style={{
                      color: "#fcd34d",
                      fontSize: "18px",
                      marginTop: 0,
                      marginBottom: "12px",
                    }}
                  >
                    Regions
                  </h3>

                  <div
                    style={{
                      display: "grid",
                      gap: "10px",
                    }}
                  >
                    {regions.map((region) => (
                      <ColorCheckboxItem
                        key={region.id}
                        color={region.color}
                        label={region.name}
                        checked={regionFilters[region.id] === true}
                        onChange={() =>
                          setRegionFilters((previousFilters) => ({
                            ...previousFilters,
                            [region.id]: !previousFilters[region.id],
                          }))
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </aside>
  );
}

/*
  Main App.
*/
export default function App() {
  const [currentUser, setCurrentUser] = useState(() => getSavedUser());
  const [selectedCity, setSelectedCity] = useState(null);
  const [lastClick, setLastClick] = useState(null);
  const [musicPlaying, setMusicPlaying] = useState(false);

  const [routeFilters, setRouteFilters] = useState(() =>
    buildDefaultFilters(atlasConfig.routeTypes)
  );

  const [cityIconFilters, setCityIconFilters] = useState(() =>
    buildDefaultFilters(atlasConfig.cityIconTypes)
  );

  /*
    Factions and regions are both toggled off by default.
  */
  const [atlasLayerFilters, setAtlasLayerFilters] = useState({
    factions: false,
    regions: false,
  });

  /*
    Individual faction and region options are also off by default.
  */
  const [factionFilters, setFactionFilters] = useState(() =>
    buildDefaultFilters(factions, false)
  );

  const [regionFilters, setRegionFilters] = useState(() =>
    buildDefaultFilters(regions, false)
  );

  const musicRef = useRef(null);
  const cityClickSoundRef = useRef(null);

  /*
    Try to start the map music after the user logs in.
    Some browsers will block this until the user clicks.
  */
  useEffect(() => {
    if (!currentUser) return;
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
  }, [currentUser]);

  /*
    Logs the user out and returns to the login screen.
  */
  function handleLogout() {
    localStorage.removeItem("triokaUser");
    setCurrentUser(null);
    setSelectedCity(null);
    setLastClick(null);
    setMusicPlaying(false);

    if (musicRef.current) {
      musicRef.current.pause();
      musicRef.current.currentTime = 0;
    }
  }

  /*
    Map click handler.

    Reads where the user clicked.
    Converts screen position into map x/y coordinates.

    This also clears the selected city.
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

  /*
    Shows the login screen before the atlas loads.
  */
  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
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
      <audio ref={musicRef} src={atlasConfig.audio.music} preload="auto" />
      <audio
        ref={cityClickSoundRef}
        src={atlasConfig.audio.cityClick}
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
        {/* Login status bar */}
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            marginBottom: "12px",
            backgroundColor: "#3d0f0f",
            border: "0.5px solid #1a0206",
            borderRadius: "12px",
            padding: "12px 16px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              color: "#cbd5e1",
              fontSize: "15px",
            }}
          >
            Logged in as:{" "}
            <strong
              style={{
                color: "#fcd34d",
              }}
            >
              {currentUser.displayName ?? currentUser.username ?? "Unknown User"}
            </strong>{" "}
            <span
              style={{
                color: "#94a3b8",
              }}
            >
              ({currentUser.role ?? "unknown role"})
            </span>
          </div>

          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#111827",
              color: "white",
              border: "1px solid #fcd34d",
              borderRadius: "8px",
              padding: "8px 12px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Logout
          </button>
        </div>

        {/* Map container */}
        <div
          onClick={handleMapClick}
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: `${MAP_WIDTH} / ${MAP_HEIGHT}`,
            overflow: "hidden",
            borderRadius: "16px",
            border: "1px solid #334155",
            boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
            backgroundColor: "#111827",
          }}
        >
          {/* Map image */}
          <img
            src={atlasConfig.map.image}
            alt={atlasConfig.map.alt}
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

          {/* Road, trade route, sea route, faction, and region route layer */}
          <RouteLayer
            routes={routes}
            selectedCity={selectedCity}
            routeFilters={routeFilters}
            atlasLayerFilters={atlasLayerFilters}
            factionFilters={factionFilters}
            regionFilters={regionFilters}
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

              const highlightColor = getCityHighlightColor(
                city,
                atlasLayerFilters,
                factionFilters,
                regionFilters
              );

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
                      filter: getCityMarkerFilter(isSelected, highlightColor),
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
              boxSizing: "border-box",
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

                {/* Faction and region */}
                {(getCityFactionName(selectedCity) ||
                  getCityRegionName(selectedCity)) && (
                  <p
                    style={{
                      color: "#94a3b8",
                      fontSize: "14px",
                      marginTop: "-8px",
                      lineHeight: 1.5,
                    }}
                  >
                    {getCityFactionName(selectedCity) && (
                      <>
                        {getCityFactionName(selectedCity)}
                        <br />
                      </>
                    )}

                    {getCityRegionName(selectedCity) && (
                      <>{getCityRegionName(selectedCity)}</>
                    )}
                  </p>
                )}

                {/* City image */}
                {selectedCity.portraits && (
                  <img
                    src={selectedCity.portraits}
                    alt={`${selectedCity.name} image`}
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

                {/* Known for */}
                {Array.isArray(selectedCity.knownFor) &&
                  selectedCity.knownFor.length > 0 && (
                    <>
                      <h3
                        style={{
                          color: "#fcd34d",
                          fontSize: "18px",
                          marginBottom: "8px",
                        }}
                      >
                        Known For
                      </h3>

                      <ul
                        style={{
                          color: "#cbd5e1",
                          lineHeight: 1.6,
                          paddingLeft: "20px",
                        }}
                      >
                        {selectedCity.knownFor.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </>
                  )}

                {/* Quest hooks */}
                {Array.isArray(selectedCity.questHooks) &&
                  selectedCity.questHooks.length > 0 && (
                    <>
                      <h3
                        style={{
                          color: "#fcd34d",
                          fontSize: "18px",
                          marginBottom: "8px",
                        }}
                      >
                        Quest Hooks
                      </h3>

                      <ul
                        style={{
                          color: "#cbd5e1",
                          lineHeight: 1.6,
                          paddingLeft: "20px",
                        }}
                      >
                        {selectedCity.questHooks.map((hook) => (
                          <li key={hook}>{hook}</li>
                        ))}
                      </ul>
                    </>
                  )}
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
                  {atlasConfig.projectName}
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

          {/* Map key */}
          <MapKey
            routeFilters={routeFilters}
            setRouteFilters={setRouteFilters}
            cityIconFilters={cityIconFilters}
            setCityIconFilters={setCityIconFilters}
            atlasLayerFilters={atlasLayerFilters}
            setAtlasLayerFilters={setAtlasLayerFilters}
            factionFilters={factionFilters}
            setFactionFilters={setFactionFilters}
            regionFilters={regionFilters}
            setRegionFilters={setRegionFilters}
          />
        </div>
      </div>
    </main>
  );
}