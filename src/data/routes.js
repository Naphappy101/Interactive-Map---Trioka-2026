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
    id: "caelmarisport-to-aspengeld",
    name: "Northeastern Trade Road",
    type: "trade-road",

    /*
      These are the main route endpoints.
      The route begins at Caelmarisport and ends at Aspengeld.
    */
    from: "caelmarisport",
    to: "aspengeld",

    description:
      "The major northwest trade road of the Kingdom of Essia to the Elivsh Domain.",

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
        x: 493,
        y: 93,
      },
    ],
  },
  {
    id: "beacon-to-castleforge",
    name: "Northeastern Trade Road",
    type: "trade-road",

    /*
      These are the main route endpoints.
      The route begins at Beacon and ends at Castleforge.
    */
    from: "beacon",
    to: "castleforge",

    /*
      Any city id listed here will cause this route to appear
      when that city is selected.
      Add more city ids here as you place cities along this road.
    */
    connectedCities: [
      "castleforge",
      "ganymede",
      "cape-saffar",
      "beacon",
    ],

    description:
      "The major northeast trade road of the Kingdom of Arpad to the Northern Dwarven Enclave.",

    /*
      These points control the actual drawn path.
      Add more points to bend the road more naturally across the map.
    */
    points: [
      {
        x: 821,
        y: 339,
      },
      {
        x: 866,
        y: 182,
      },
      {
        x: 1033,
        y: 177,
      },
      {
        x: 1042,
        y: 57,
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
  {
    id: "caelmarisport-to-dawnguard",
    name: "Royal Essia Trade Road",
    type: "trade-road",

    /*
      These are the main route endpoints.
      The route begins at Caelmarisport and ends at Dawnguard.
    */
    from: "caelmarisport",
    to: "dawnguard",

    /*
      Any city id listed here will cause this route to appear
      when that city is selected.
      Add more city ids here as you place cities along this road.
    */
    connectedCities: [
      "caelmarisport",
      "dawnguard",
      "centerpoint",
      "aurelions-reach",
      "rosewood",
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
        x: 712,
        y: 433,
      },
      {
        x: 707,
        y: 482,
      },
      {
        x: 636,
        y: 503,
      },
    ],
  },
  {
    id: "caelmarisport-to-freehold",
    name: "Western Depths Coastal Route",
    type: "sea-route",

    /*
      These are the main route endpoints.
      The route begins at Caelmarisport and ends at Freehold.
    */
    from: "caelmarisport",
    to: "freehold",

    /*
      Any city id listed here will cause this route to appear
      when that city is selected.
      Add more city ids here as you place cities along this road.
    */
    connectedCities: [
      "caelmarisport",
      "freehold",
      "stormcliff",
      "westhaven",
    ],

    description:
      "The treacherous coastal route along the Western Depths.",

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
        x: 435,
        y: 245,
      },
      {
        x: 399,
        y: 286,
      },
      {
        x: 422,
        y: 356,
      },
      {
        x: 485,
        y: 429,
      },
      {
        x: 499,
        y: 507,
      },
      {
        x: 447,
        y: 552,
      },
      {
        x: 363,
        y: 556,
      },
      {
        x: 266,
        y: 598,
      },
      {
        x: 204,
        y: 661,
      },
      {
        x: 231,
        y: 696,
      },
      {
        x: 218,
        y: 721,
      },
      {
        x: 264,
        y: 771,
      },
      {
        x: 236,
        y: 830,
      },
      {
        x: 244,
        y: 881,
      },
      {
        x: 284,
        y: 911,
      },
    ],
  },
  {
    id: "freehold-to-bootybay",
    name: "Tranquil Sea Coastal Route",
    type: "sea-route",

    /*
      These are the main route endpoints.
      The route begins at Freehold and ends at Bootybay.
    */
    from: "freehold",
    to: "bootybay",

    /*
      Any city id listed here will cause this route to appear
      when that city is selected.
      Add more city ids here as you place cities along this road.
    */
    connectedCities: [
      "bootybay",
      "freehold",
      "esemere",
      "vanderhold",
      "the-nest",
    ],

    description:
      "The smugglers way in the southern reaches.",

    /*
      These points control the actual drawn path.
      Add more points to bend the road more naturally across the map.
    */
    points: [
      {
        x: 284,
        y: 911,
      },
      {
        x: 309,
        y: 941,
      },
      {
        x: 377,
        y: 948,
      },
      {
        x: 413,
        y: 901,
      },
      {
        x: 466,
        y: 850,
      },
      {
        x: 503,
        y: 870,
      },
      {
        x: 508,
        y: 917,
      },
      {
        x: 654,
        y: 973,
      },
      {
        x: 698,
        y: 954,
      },
      {
        x: 734,
        y: 970,
      },
      {
        x: 851,
        y: 927,
      },
      {
        x: 877,
        y: 897,
      },
      {
        x: 904,
        y: 915,
      },
      {
        x: 930,
        y: 897,
      },
      {
        x: 956,
        y: 901,
      },
      {
        x: 992,
        y: 940,
      },
      {
        x: 1131,
        y: 954,
      },
      {
        x: 1204,
        y: 993,
      },
      {
        x: 1287,
        y: 994,
      },
      {
        x: 1289,
        y: 968,
      },
      {
        x: 1318,
        y: 983,
      },
      {
        x: 1413,
        y: 910,
      },
    ],
  },
  {
    id: "vanderhold-to-krakensmaw",
    name: "Southern Narrow Sea Route",
    type: "sea-route",

    /*
      These are the main route endpoints.
      The route begins at Vanderhold and ends at Krakensmaw.
    */
    from: "vanderhold",
    to: "krakensmaw",

    /*
      Any city id listed here will cause this route to appear
      when that city is selected.
      Add more city ids here as you place cities along this road.
    */
    connectedCities: [
      "krakensmaw",
      "vanderhold",
      "desert'smouth",
      "dragonisle",
      "ogrilswake",
    ],

    description:
      "The southern route of the narrow sea.",

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
        x: 904,
        y: 915,
      },
      {
        x: 930,
        y: 897,
      },
      {
        x: 956,
        y: 901,
      },
      {
        x: 967,
        y: 864,
      },
      {
        x: 1015,
        y: 818,
      },
      {
        x: 1070,
        y: 797,
      },
      {
        x: 1109,
        y: 735,
      },
      {
        x: 1176,
        y: 734,
      },
      {
        x: 1138,
        y: 708,
      },
      {
        x: 1146,
        y: 674,
      },
      {
        x: 1209,
        y: 698,
      },
      {
        x: 1330,
        y: 649,
      },
      {
        x: 1305,
        y: 689,
      },
      {
        x: 1311,
        y: 731,
      },
      {
        x: 1367,
        y: 760,
      },
      {
        x: 1420,
        y: 747,
      },
      {
        x: 1434,
        y: 710,
      },
      {
        x: 1418,
        y: 678,
      },
    ],
  },
];