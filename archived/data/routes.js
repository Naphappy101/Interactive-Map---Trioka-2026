/*
  Route data.
  from and to must match city ids in locations.js.
  connectedCities controls which city selections reveal the route.
  points use the same 1578 x 996 map coordinate system as city markers.
*/

export const routes = [

  /* THE FIRST SECTION IS FOR TRADE ROADS. */
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
        x: 586,
        y: 236,
      },
      {
        x: 659,
        y: 219,
      },
      {
        x: 691,
        y: 245,
      },
      {
        x: 741,
        y: 250,
      },
      {
        x: 714,
        y: 290,
      },
      {
        x: 705,
        y: 338,
      },
      {
        x: 783,
        y: 325,
      },
      {
        x: 821,
        y: 339,
      },
      {
        x: 836,
        y: 421,
      },
      {
        x: 903,
        y: 462,
      },
      {
        x: 916,
        y: 538,
      },
      {
        x: 953,
        y: 575,
      },
      {
        x: 964,
        y: 627,
      },
      {
        x: 1001,
        y: 669,
      },
    ],
  },
    {
    id: "caelmarisport-to-aspengeld",
    name: "Northwestern Trade Road",
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
        x: 506,
        y: 195,
      },
      {
        x: 516,
        y: 147,
      },
      {
        x: 505,
        y: 114,
      },
      {
        x: 493,
        y: 93,
      },
    ],
  },
  {
    id: "caelmarisport-to-stormcliff",
    name: "Southwestern Trade Road",
    type: "trade-road",

    /*
      These are the main route endpoints.
      The route begins at Caelmarisport and ends at Stormcliff.
    */
    from: "caelmarisport",
    to: "stormcliff",

    /*
      Any city id listed here will cause this route to appear
      when that city is selected.
      Add more city ids here as you place cities along this road.
    */
    connectedCities: [
      "caelmarisport",
      "athran-point",
      "southport",
      "stormcliff",
    ],

    description:
      "The major southwestern trade road of the Kingdom of Essia to the Southern Dwarven Enclave.",

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
        x: 510,
        y: 260,
      },
      {
        x: 516,
        y: 305,
      },
      {
        x: 511,
        y: 322,
      },
      {
        x: 493,
        y: 338,
      },
      {
        x: 466,
        y: 339,
      },
      {
        x: 476,
        y: 388,
      },
      {
        x: 512,
        y: 412,
      },
      {
        x: 521,
        y: 440,
      },
      {
        x: 540,
        y: 462,
      },
      {
        x: 530,
        y: 491,
      },
      {
        x: 499,
        y: 507,
      },
    ],
  },
  {
    id: "westhaven-to-stormcliff",
    name: "Southwestern Trade Road Southern Branch",
    type: "trade-road",

    /*
      These are the main route endpoints.
      The route begins at Westhaven and ends at Stormcliff.
    */
    from: "westhaven",
    to: "stormcliff",

    /*
      Any city id listed here will cause this route to appear
      when that city is selected.
      Add more city ids here as you place cities along this road.
    */
    connectedCities: [
      "westhaven",
      "stormcliff",
      "pleasant-valley",
      "newhaven",
      "rivercross",
      "mountpass",
    ],

    description:
      "The major south-north trade road of free cities and the southern dwarven enclave.",

    /*
      These points control the actual drawn path.
      Add more points to bend the road more naturally across the map.
    */
    points: [
      {
        x: 231,
        y: 696,
      },
      {
        x: 275,
        y: 692,
      },
      {
        x: 315,
        y: 713,
      },
      {
        x: 337,
        y: 741,
      },
      {
        x: 333,
        y: 772,
      },
      {
        x: 364,
        y: 753,
      },
      {
        x: 403,
        y: 756,
      },
      {
        x: 396,
        y: 713,
      },
      {
        x: 381,
        y: 698,
      },
      {
        x: 372,
        y: 677,
      },
      {
        x: 409,
        y: 649,
      },
      {
        x: 460,
        y: 625,
      },
      {
        x: 448,
        y: 608,
      },
      {
        x: 482,
        y: 559,
      },
      {
        x: 499,
        y: 507,
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
      "constantine",
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
        x: 807,
        y: 302,
      },
      {
        x: 823,
        y: 276,
      },
      {
        x: 814,
        y: 250,
      },
      {
        x: 873,
        y: 215,
      },
      {
        x: 866,
        y: 182,
      },
      {
        x: 886,
        y: 195,
      },
      {
        x: 914,
        y: 176,
      },
      {
        x: 922,
        y: 142,
      },
      {
        x: 970,
        y: 140,
      },
      {
        x: 982,
        y: 177,
      },
      {
        x: 1033,
        y: 177,
      },
      {
        x: 1027,
        y: 143,
      },
      {
        x: 1042,
        y: 124,
      },
      {
        x: 1056,
        y: 87,
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
        x: 867,
        y: 831,
      },
      {
        x: 793,
        y: 764,
      },
      {
        x: 757,
        y: 714,
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
        x: 674,
        y: 614,
      },
       {
        x: 632,
        y: 581,
      },
      {
        x: 652,
        y: 525,
      },
      {
        x: 636,
        y: 503,
      },
      {
        x: 599,
        y: 554,
      },
       {
        x: 549,
        y: 584,
      },
      {
        x: 482,
        y: 559,
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
        x: 586,
        y: 236,
      },
      {
        x: 659,
        y: 219,
      },
      {
        x: 691,
        y: 245,
      },
      {
        x: 741,
        y: 250,
      },
      {
        x: 714,
        y: 290,
      },
      {
        x: 705,
        y: 338,
      },
      {
        x: 688,
        y: 359,
      },
      {
        x: 701,
        y: 393,
      },
      {
        x: 712,
        y: 433,
      },
      {
        x: 715,
        y: 458,
      },
      {
        x: 707,
        y: 482,
      },
      {
        x: 665,
        y: 501,
      },
      {
        x: 636,
        y: 503,
      },
    ],
  },

  /* THE SECOND SECTION IS FOR SEA ROUTES. */
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
      "southport",
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
        x: 501,
        y: 435,
      },
      {
        x: 521,
        y: 440,
      },
      {
        x: 507,
        y: 464,
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
    id: "bayview-landing-to-desert'smouth",
    name: "Narrow Sea Crossings",
    type: "sea-route",

    /*
      These are the main route endpoints.
      The route begins at bayview-landing and ends at desert'smouth.
    */
    from: "bayview-landing",
    to: "desert'smouth",

    /*
      Any city id listed here will cause this route to appear
      when that city is selected.
      Add more city ids here as you place cities along this road.
    */
    connectedCities: [
      "bayview-landing",
      "dragonisle",
      "anchorhorn",
      "desert'smouth",
    ],

    description:
      "The Narrow Sea span crossings.",

    /*
      These points control the actual drawn path.
      Add more points to bend the road more naturally across the map.
    */
    points: [
      {
        x: 846,
        y: 639,
      },
      {
        x: 1015,
        y: 818,
      },
      {
        x: 1001,
        y: 669,
      },
      {
        x: 1176,
        y: 734,
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
    id: "anchorhorn-to-cape-saffar",
    name: "The Narrow Sea Route",
    type: "sea-route",

    /*
      These are the main route endpoints.
      The route begins at Anchorhorn and ends at Cape Saffar.
    */
    from: "anchorhorn",
    to: "cape-saffar",

    /*
      Any city id listed here will cause this route to appear
      when that city is selected.
      Add more city ids here as you place cities along this road.
    */
    connectedCities: [
      "anchorhorn",
      "fang-cove",
      "portsmith",
      "north-castleport",
      "cape-saffar",
    ],

    description:
      "The north-south route of the narrow sea.",

    /*
      These points control the actual drawn path.
      Add more points to bend the road more naturally across the map.
    */
    points: [
      {
        x: 1001,
        y: 669,
      },
      {
        x: 1031,
        y: 667,
      },
      {
        x: 1056,
        y: 608,
      },
      {
        x: 1063,
        y: 575,
      },
      {
        x: 1132,
        y: 541,
      },
      {
        x: 1094,
        y: 527,
      },
      {
        x: 1081,
        y: 466,
      },
      {
        x: 1054,
        y: 441,
      },
      {
        x: 989,
        y: 404,
      },
      {
        x: 1026,
        y: 388,
      },
      {
        x: 1020,
        y: 373,
      },
      {
        x: 1007,
        y: 336,
      },
      {
        x: 969,
        y: 295,
      },
      {
        x: 985,
        y: 273,
      },
      {
        x: 1004,
        y: 235,
      },
      {
        x: 1026,
        y: 213,
      },
      {
        x: 1032,
        y: 177,
      },
    ],
  },
  {
    id: "lastport-to-ogrilswake",
    name: "The North Lyth Bay cross Narrow Sea Route",
    type: "sea-route",

    /*
      These are the main route endpoints.
      The route begins at Lastport and ends at Ogrilswake.
    */
    from: "lastport",
    to: "ogrilswake",

    /*
      Any city id listed here will cause this route to appear
      when that city is selected.
      Add more city ids here as you place cities along this road.
    */
    connectedCities: [
      "lastport",
      "bayview-landing",
      "anchorhorn",
      "fang-cove",
      "ogrilswake",
    ],

    description:
      "The north-south route of the narrow sea.",

    /*
      These points control the actual drawn path.
      Add more points to bend the road more naturally across the map.
    */
    points: [
      {
        x: 720,
        y: 623,
      },
      {
        x: 731,
        y: 589,
      },
      {
        x: 771,
        y: 625,
      },
      {
        x: 796,
        y: 647,
      },
      {
        x: 834,
        y: 671,
      },
      {
        x: 846,
        y: 639,
      },
      {
        x: 878,
        y: 670,
      },
      {
        x: 915,
        y: 674,
      },
      {
        x: 951,
        y: 684,
      },
      {
        x: 1001,
        y: 669,
      },
      {
        x: 1031,
        y: 667,
      },
      {
        x: 1056,
        y: 608,
      },
      {
        x: 1063,
        y: 575,
      },
      {
        x: 1132,
        y: 541,
      },
      {
        x: 1174,
        y: 571,
      },
      {
        x: 1182,
        y: 598,
      },
      {
        x: 1229,
        y: 630,
      },
      {
        x: 1276,
        y: 637,
      },
      {
        x: 1330,
        y: 649,
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
  {
    id: "vanderhold-to-anchorhorn",
    name: "Bayside Narrow Sea Route",
    type: "sea-route",

    /*
      These are the main route endpoints.
      The route begins at Vanderhold and ends at Anchorhorn.
    */
    from: "vanderhold",
    to: "anchorhorn",

    /*
      Any city id listed here will cause this route to appear
      when that city is selected.
      Add more city ids here as you place cities along this road.
    */
    connectedCities: [
      "lastport",
      "vanderhold",
      "bayview-landing",
      "anchorhorn",
    ],

    description:
      "The bayside route of the narrow sea.",

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
        x: 921,
        y: 841,
      },
      {
        x: 905,
        y: 810,
      },
      {
        x: 881,
        y: 778,
      },
      {
        x: 862,
        y: 758,
      },
      {
        x: 818,
        y: 738,
      },
      {
        x: 808,
        y: 713,
      },
      {
        x: 802,
        y: 692,
      },
      {
        x: 771,
        y: 661,
      },
      {
        x: 743,
        y: 628,
      },
      {
        x: 720,
        y: 623,
      },
      {
        x: 731,
        y: 589,
      },
      {
        x: 771,
        y: 625,
      },
      {
        x: 796,
        y: 647,
      },
      {
        x: 834,
        y: 671,
      },
      {
        x: 846,
        y: 639,
      },
      {
        x: 878,
        y: 670,
      },
      {
        x: 915,
        y: 674,
      },
      {
        x: 951,
        y: 684,
      },
      {
        x: 1001,
        y: 669,
      },
    ],
  },
  {
    id: "caelmarisport-to-cape-saffar",
    name: "Treaterous Northern Ice Flow Route",
    type: "sea-route",

    /*
      These are the main route endpoints.
      The route begins at Caelmarisport and ends at Cape Saffar.
    */
    from: "caelmarisport",
    to: "cape-saffar",

    /*
      Any city id listed here will cause this route to appear
      when that city is selected.
      Add more city ids here as you place cities along this road.
    */
    connectedCities: [
      "caelmarisport",
      "cape-saffar",
      "whitewake",
    ],

    description:
      "The seasonal northern ice flow sea route.",

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
        x: 450,
        y: 203,
      },
      {
        x: 369,
        y: 136,
      },
      {
        x: 349,
        y: 92,
      },
      {
        x: 377,
        y: 47,
      },
      {
        x: 440,
        y: 36,
      },
      {
        x: 552,
        y: 46,
      },
      {
        x: 609,
        y: 30,
      },
      {
        x: 652,
        y: 1,
      },
      {
        x: 691,
        y: 10,
      },
      {
        x: 694,
        y: 40,
      },
      {
        x: 740,
        y: 1,
      },
      {
        x: 785,
        y: 13,
      },
      {
        x: 784,
        y: 60,
      },
      {
        x: 807,
        y: 66,
      },
      {
        x: 926,
        y: 39,
      },
      {
        x: 1009,
        y: 20,
      },
      {
        x: 1078,
        y: 27,
      },
      {
        x: 1102,
        y: 62,
      },
      {
        x: 1079,
        y: 130,
      },
      {
        x: 1032,
        y: 177,
      },
    ],
  },

  /* THE THIRD SECTION IS FOR ROADS. */
{
    id: "vanderhold-to-oasimere",
    name: "The desert road",
    type: "road",

    /*
      These are the main route endpoints.
      The route begins at Vanderhold and ends at Stormcliff.
    */
    from: "vanderhold",
    to: "oasimere",

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
        x: 800,
        y: 890,
      },
      {
        x: 751,
        y: 855,
      },
      {
        x: 687,
        y: 859,
      },
    ],
  },
];