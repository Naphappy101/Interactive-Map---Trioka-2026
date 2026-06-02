/*
  Route data.
  from and to must match city ids in locations.js.
  connectedCities controls which city selections reveal the route.
  points use the same 1578 x 996 map coordinate system as city markers.
*/

export const routes = [
  {
    id: "caelmarisport-to-anchorhorn",
    name: "Royal Lyth Trade Road",
    type: "trade-road",

    /*
      These are the main route endpoints.
      The route begins at Caelmarisport and ends at Anchorhorn.
    */
    from: "caelmarisport",
    to: "anchorhorn",

    /*
      Any city id listed here will cause this route to appear
      when that city is selected.
      Add more city ids here as you place cities along this road.
    */
    connectedCities: [
      "caelmarisport",
      "anchorhorn",
      "centerpoint",
      "aurelions-reach",
      "beacon",
      "riverscrown",
    ],

    description:
      "The major north-south trade road of the human kingdoms in Ostirose.",

    /*
      These points control the actual drawn path.
      Add more points to bend the road more naturally across the map.
    */
    points: [
      {
        x: 492,
        y: 225,
      },
      {
        x: 659,
        y: 219,
      },
      {
        x: 705,
        y: 338,
      },
      {
        x: 821,
        y: 339,
      },
      {
        x: 916,
        y: 538,
      },
      {
        x: 1001,
        y: 669,
      },
    ],
  },
  {
    id: "vanderhold-to-stormcliff",
    name: "The Great Southern Way",
    type: "trade-road",

    /*
      These are the main route endpoints.
      The route begins at Vanderhold and ends at Stormcliff.
    */
    from: "vanderhold",
    to: "stormcliff",

    /*
      Any city id listed here will cause this route to appear
      when that city is selected.
      Add more city ids here as you place cities along this road.
    */
    connectedCities: [
      "vanderhold",
      "stormcliff",
      "dawnguard",
      "lastport",
      "shadowstone",
      "hourglass",
    ],

    description:
      "The major southern trade route between the Confederation of Free Cities and the Southern Dwarven Enclave.",

    /*
      These points control the actual drawn path.
      Add more points to bend the road more naturally across the map.
    */
    points: [
      {
        x: 877,
        y: 897,
      },
      {
        x: 793,
        y: 764,
      },
      {
        x: 681,
        y: 681,
      },
      {
        x: 720,
        y: 623,
      },
       {
        x: 632,
        y: 581,
      },
      {
        x: 636,
        y: 503,
      },
       {
        x: 549,
        y: 584,
      },
      {
        x: 499,
        y: 507,
      },
    ],
  },
];