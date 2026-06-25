import atlasConfig from "../data/AtlasConfig.json";
import cities from "../data/cities.json";
import factions from "../data/factions.json";
import regions from "../data/regions.json";

/*
  RouteLayer for roads, trade routes, sea paths, and atlas highlights.

  Normal route behavior:
  1. A city is selected.
  2. The route connects to that selected city.
  3. That route type is currently checked on.

  Atlas highlight behavior:
  1. Factions or regions are turned on in the Map Key.
  2. A faction or region option is checked.
  3. Matching routes are highlighted even if no city is selected.
*/

const MAP_WIDTH = atlasConfig.map?.width ?? 1578;
const MAP_HEIGHT = atlasConfig.map?.height ?? 996;

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
  Turns route points into SVG points.

  This supports route points written as:
  { x: 492, y: 225 }

  It also still supports route points written as:
  [492, 225]
*/
function convertPointsToSvgPoints(points) {
  if (!Array.isArray(points)) return "";

  return points
    .map((point) => {
      const pointX = Array.isArray(point) ? point[0] : point.x;
      const pointY = Array.isArray(point) ? point[1] : point.y;

      return `${pointX},${pointY}`;
    })
    .join(" ");
}

/*
  Gets route visual settings from AtlasConfig.json.

  Your AtlasConfig.json routeTypes should use ids like:
  "road"
  "trade-road"
  "sea-route"
*/
function getRouteTypeConfig(routeType) {
  return atlasConfig.routeTypes?.find((item) => item.id === routeType);
}

/*
  Gives each route type its own visual style.

  Primary source:
  AtlasConfig.json

  Fallback:
  Old hardcoded colors, in case a route type is missing from AtlasConfig.json.
*/
function getRouteStyle(routeType) {
  const routeTypeConfig = getRouteTypeConfig(routeType);

  if (routeTypeConfig) {
    return {
      stroke: routeTypeConfig.color ?? "#ffffff",
      strokeWidth: routeTypeConfig.strokeWidth ?? "3",
      strokeDasharray: routeTypeConfig.dashArray ?? "none",
    };
  }

  if (routeType === "road") {
    return {
      stroke: "#d1d5db",
      strokeWidth: "3",
      strokeDasharray: "none",
    };
  }

  if (routeType === "trade-road") {
    return {
      stroke: "#f59e0b",
      strokeWidth: "3",
      strokeDasharray: "6 5",
    };
  }

  if (routeType === "sea-route") {
    return {
      stroke: "#3b82f6",
      strokeWidth: "3",
      strokeDasharray: "8 6",
    };
  }

  return {
    stroke: "#ffffff",
    strokeWidth: "4",
    strokeDasharray: "none",
  };
}

/*
  Checks if a route connects to the selected city.

  This works with:
  from: "city-id"
  to: "city-id"

  It also supports:
  connectedCities: ["city-id", "city-id"]
*/
function routeConnectsToSelectedCity(route, selectedCity) {
  if (!selectedCity) return false;

  if (route.from === selectedCity.id) return true;
  if (route.to === selectedCity.id) return true;

  if (Array.isArray(route.connectedCities)) {
    return route.connectedCities.includes(selectedCity.id);
  }

  return false;
}

/*
  Checks if the route type is currently turned on.

  route.type should be one of:
  "road"
  "trade-road"
  "sea-route"

  routeFilters should use the same names:
  {
    "road": true,
    "trade-road": true,
    "sea-route": true
  }
*/
function routeTypeIsTurnedOn(route, routeFilters) {
  if (!route.type) return false;
  if (!routeFilters) return false;

  return routeFilters[route.type] === true;
}

/*
  Gets faction ids from a city.

  Preferred city JSON:
  "factionId": "sundrin-empire"

  Also supports:
  "factionIds": ["sundrin-empire"]

  Optional fallback:
  "faction": "Sundrin Empire"
*/
function getCityFactionIds(city) {
  const ids = [
    ...valueToArray(city.factionId),
    ...valueToArray(city.factionIds),
  ];

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

  Preferred city JSON:
  "regionId": "ulden"

  Also supports:
  "regionIds": ["ulden"]

  Optional fallback:
  "region": "Ulden"
*/
function getCityRegionIds(city) {
  const ids = [
    ...valueToArray(city.regionId),
    ...valueToArray(city.regionIds),
  ];

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
  Gets city objects related to a route.

  This lets route highlighting still work even if your routes.json does not
  have factionIds or regionIds yet.

  It checks:
  - route.from
  - route.to
  - route.connectedCities
*/
function getRouteRelatedCities(route) {
  const routeCityIds = new Set([
    ...valueToArray(route.from),
    ...valueToArray(route.to),
    ...valueToArray(route.connectedCities),
  ]);

  return cities.filter((city) => routeCityIds.has(city.id));
}

/*
  Gets faction ids from a route.

  Preferred route JSON:
  "factionIds": ["kingdom-of-lyth"]

  Also supports:
  "factionId": "kingdom-of-lyth"

  Fallback:
  Uses from/to/connectedCities and checks those cities for factionId values.
*/
function getRouteFactionIds(route) {
  const explicitIds = uniqueArray([
    ...valueToArray(route.factionId),
    ...valueToArray(route.factionIds),
  ]);

  if (explicitIds.length > 0) {
    return explicitIds;
  }

  const derivedIds = getRouteRelatedCities(route).flatMap((city) =>
    getCityFactionIds(city)
  );

  return uniqueArray(derivedIds);
}

/*
  Gets region ids from a route.

  Preferred route JSON:
  "regionIds": ["narrow-sea"]

  Also supports:
  "regionId": "narrow-sea"

  Fallback:
  Uses from/to/connectedCities and checks those cities for regionId values.
*/
function getRouteRegionIds(route) {
  const explicitIds = uniqueArray([
    ...valueToArray(route.regionId),
    ...valueToArray(route.regionIds),
  ]);

  if (explicitIds.length > 0) {
    return explicitIds;
  }

  const derivedIds = getRouteRelatedCities(route).flatMap((city) =>
    getCityRegionIds(city)
  );

  return uniqueArray(derivedIds);
}

/*
  Gets the first selected color from a list of ids.
*/
function getSelectedEntityColor(ids, filters, items) {
  const selectedId = ids.find((id) => filters?.[id] === true);

  if (!selectedId) {
    return null;
  }

  const selectedItem = items.find((item) => item.id === selectedId);

  return selectedItem?.color ?? "#fcd34d";
}

/*
  Route highlight color.

  Factions take priority over regions if both are enabled.
*/
function getRouteHighlightColor(
  route,
  routeFilters,
  atlasLayerFilters,
  factionFilters,
  regionFilters
) {
  if (!routeTypeIsTurnedOn(route, routeFilters)) {
    return null;
  }

  if (atlasLayerFilters?.factions) {
    const factionColor = getSelectedEntityColor(
      getRouteFactionIds(route),
      factionFilters,
      factions
    );

    if (factionColor) {
      return factionColor;
    }
  }

  if (atlasLayerFilters?.regions) {
    const regionColor = getSelectedEntityColor(
      getRouteRegionIds(route),
      regionFilters,
      regions
    );

    if (regionColor) {
      return regionColor;
    }
  }

  return null;
}

export default function RouteLayer({
  routes,
  selectedCity,
  routeFilters,
  atlasLayerFilters = {
    factions: false,
    regions: false,
  },
  factionFilters = {},
  regionFilters = {},
}) {
  const normalRoutes = selectedCity
    ? routes.filter((route) => {
        const connectsToSelectedCity = routeConnectsToSelectedCity(
          route,
          selectedCity
        );

        const selectedRouteTypeIsTurnedOn = routeTypeIsTurnedOn(
          route,
          routeFilters
        );

        return connectsToSelectedCity && selectedRouteTypeIsTurnedOn;
      })
    : [];

  const highlightedRoutes = routes
    .map((route) => ({
      route,
      highlightColor: getRouteHighlightColor(
        route,
        routeFilters,
        atlasLayerFilters,
        factionFilters,
        regionFilters
      ),
    }))
    .filter((item) => item.highlightColor && Array.isArray(item.route.points));

  if (normalRoutes.length === 0 && highlightedRoutes.length === 0) {
    return null;
  }

  return (
    <svg
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 4,
        overflow: "visible",
      }}
    >
      {/* Faction and region route highlights */}
      {highlightedRoutes.map(({ route, highlightColor }) => {
        const routeStyle = getRouteStyle(route.type);

        return (
          <polyline
            key={`highlight-${route.id}`}
            points={convertPointsToSvgPoints(route.points)}
            fill="none"
            stroke={highlightColor}
            strokeWidth="8"
            strokeDasharray={
              routeStyle.strokeDasharray === "none"
                ? undefined
                : routeStyle.strokeDasharray
            }
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            opacity="0.95"
            style={{
              filter: `drop-shadow(0 0 6px ${highlightColor}) drop-shadow(0 0 12px ${highlightColor})`,
            }}
          />
        );
      })}

      {/* Normal selected-city routes */}
      {normalRoutes.map((route) => {
        const routeStyle = getRouteStyle(route.type);

        return (
          <polyline
            key={route.id}
            points={convertPointsToSvgPoints(route.points)}
            fill="none"
            stroke={routeStyle.stroke}
            strokeWidth={routeStyle.strokeWidth}
            strokeDasharray={
              routeStyle.strokeDasharray === "none"
                ? undefined
                : routeStyle.strokeDasharray
            }
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            style={{
              filter: "drop-shadow(0 0 3px rgba(0, 0, 0, 0.85))",
            }}
          />
        );
      })}
    </svg>
  );
}