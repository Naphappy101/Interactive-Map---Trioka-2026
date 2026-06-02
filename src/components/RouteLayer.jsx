/*
  Route layer.
  Draws roads, trade routes, and sea routes over the map.
  Only routes connected to the selected city are shown.
*/

const MAP_WIDTH = 1578;
const MAP_HEIGHT = 996;

/*
  Route color.
  Trade roads are orange.
  Sea routes are blue.
  Normal roads are gray.
*/
function getRouteColor(route) {
  if (route.type === "sea-route") {
    return "#2563eb";
  }

  if (route.type === "trade-road") {
    return "#d97706";
  }

  return "#9ca3af";
}

/*
  Route dash pattern.
  Sea routes and trade roads use different dashed lines.
  Normal roads use a solid line.
*/
function getRouteDashArray(route) {
  if (route.type === "sea-route") {
    return "10 8";
  }

  if (route.type === "trade-road") {
    return "4 4";
  }

  return "none";
}

/*
  Route path builder.
  Converts route points into an SVG path.
  This allows routes to bend through multiple map points.
*/
function buildRoutePath(points) {
  if (!points || points.length === 0) {
    return "";
  }

  const firstPoint = points[0];

  const remainingPoints = points
    .slice(1)
    .map((point) => `L ${point.x} ${point.y}`)
    .join(" ");

  return `M ${firstPoint.x} ${firstPoint.y} ${remainingPoints}`;
}

/*
  Route connection checker.
  Lets a route appear for its endpoints and for any middle cities
  listed in connectedCities.
*/
function isRouteConnectedToCity(route, cityId) {
  if (!cityId) {
    return false;
  }

  /*
    from and to are the route endpoints.
    These still count as connected cities.
  */
  if (route.from === cityId || route.to === cityId) {
    return true;
  }

  /*
    connectedCities lets one long route appear for cities along the road,
    even if those cities are not the start or end of the route.
  */
  if (Array.isArray(route.connectedCities)) {
    return route.connectedCities.includes(cityId);
  }

  return false;
}

/*
  Route layer component.
  Routes are hidden until a city is selected.
  Then only routes connected to that city are shown.
*/
export default function RouteLayer({ routes = [], selectedCity = null }) {
  const visibleRoutes = selectedCity
    ? routes.filter((route) => {
        return isRouteConnectedToCity(route, selectedCity.id);
      })
    : [];

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

        /*
          Routes sit above the map image.
          City markers sit above routes.
        */
        zIndex: 5,
      }}
    >
      {visibleRoutes.map((route) => {
        const routePath = buildRoutePath(route.points);

        if (!routePath) {
          return null;
        }

        return (
          <path
            key={route.id}
            d={routePath}
            fill="none"
            stroke={getRouteColor(route)}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={getRouteDashArray(route)}
            opacity="0.9"
            style={{
              filter: "drop-shadow(0 0 5px rgba(255, 255, 255, 0.45))",
            }}
          />
        );
      })}
    </svg>
  );
}