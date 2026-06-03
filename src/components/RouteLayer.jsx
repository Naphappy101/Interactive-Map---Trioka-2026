/*
  RouteLayer draws roads, trade roads, and sea routes.

  It does not store routes inside each city.
  It uses the master routes list from routes.js.

  It only shows routes when:
  1. A city is selected.
  2. The route connects to that selected city.
  3. That route type is currently checked on.
*/

const MAP_WIDTH = 1578;
const MAP_HEIGHT = 996;

/*
  Turns map x/y points into SVG percentage points.

  This keeps route lines lined up with the map even when the map scales.

  This supports route points written as:
  { x: 492, y: 225 }

  It also still supports route points written as:
  [492, 225]
*/
function convertPointsToSvgPoints(points) {
  return points
    .map((point) => {
      const pointX = Array.isArray(point) ? point[0] : point.x;
      const pointY = Array.isArray(point) ? point[1] : point.y;

      const percentX = (pointX / MAP_WIDTH) * 100;
      const percentY = (pointY / MAP_HEIGHT) * 100;

      return `${percentX},${percentY}`;
    })
    .join(" ");
}

/*
  Gives each route type its own visual style.
  These are inline SVG styles, not CSS edits.
*/
function getRouteStyle(routeType) {
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

  This works with a route that has:
  from: "city-id"
  to: "city-id"

  It also supports:
  connectedCities: ["city-id", "city-id"]
*/
function routeConnectsToSelectedCity(route, selectedCity) {
  if (!selectedCity) return false;

  if (route.from === selectedCity.id) return true;
  if (route.to === selectedCity.id) return true;

  if (route.connectedCities?.includes(selectedCity.id)) return true;

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

export default function RouteLayer({ routes, selectedCity, routeFilters }) {
  if (!selectedCity) return null;

  const visibleRoutes = routes.filter((route) => {
    const connectsToSelectedCity = routeConnectsToSelectedCity(
      route,
      selectedCity
    );

    const selectedRouteTypeIsTurnedOn = routeTypeIsTurnedOn(
      route,
      routeFilters
    );

    return connectsToSelectedCity && selectedRouteTypeIsTurnedOn;
  });

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 4,
      }}
    >
      {visibleRoutes.map((route) => {
        const routeStyle = getRouteStyle(route.type);

        return (
          <polyline
            key={route.id}
            points={convertPointsToSvgPoints(route.points)}
            fill="none"
            stroke={routeStyle.stroke}
            strokeWidth={routeStyle.strokeWidth}
            strokeDasharray={routeStyle.strokeDasharray}
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