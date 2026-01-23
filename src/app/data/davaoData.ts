import { Mountain, TreePine, Sun, Waves, Compass } from "lucide-react";

export type Category = "Beach" | "Rural" | "City Tours" | "Cultural";

export interface Destination {
  name: string;
  category: Category;
  description?: string;
  lat: number;
  lng: number;
  image: string;
}

export interface Hotel {
  name: string;
  rating?: number;
  priceRange?: string;
  image: string;
}

export interface Province {
  id: string;
  name: string;
  tagline: string;
  icon: any;
  color: string;
  spots: Destination[];
  hotels: Hotel[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const davaoCityCategories: Category[] = ["Beach", "Rural", "City Tours", "Cultural"];

export const provinces: Province[] = [
  // Davao de Oro
  {
    id: "davao-de-oro",
    name: "Davao de Oro",
    tagline: "Golden Adventures Await",
    icon: Mountain,
    color: "from-yellow-400 to-amber-600",
    spots: [
      { name: "Compostela Municipal Plaza", category: "City Tours", lat: 7.4139, lng: 125.9685, image: "compostela-municipal-plaza.jpg" },
      { name: "Pantukan Municipal Plaza", category: "City Tours", lat: 7.2, lng: 126.1980, image: "pantukan-municipal-plaza.jpg" },
      { name: "Provincial Capitol Grounds Nabunturan", category: "City Tours", lat: 7.3628, lng: 125.9, image: "provincial-capitol-grounds-nabunturan.jpg" },
    ],
    hotels: [
      { name: "Dusit Thani Lubi Plantation Resort", image: "dusit-thani-lubi-plantation-resort.jpg" },
      { name: "Amor Laut", image: "amor-laut.jpg" },
      { name: "Puting Bonbon Beach", image: "puting-bonbon-beach.jpg" },
      { name: "Qi Xiang Business Inn", image: "qi-xiang-business-inn.jpg" },
      { name: "Cozy Quartelle", image: "cozy-quartelle.jpg" },
      { name: "1018 Luxury Hometel", image: "1018-luxury-hometel.jpg" },
      { name: "Queen Express Inn", image: "queen-express-inn.jpg" },
      { name: "Cocos Hotel and Delis Brew Restaurant", image: "cocos-hotel-and-delis-brew-restaurant.jpg" },
    ],
    coordinates: { lat: 7.5, lng: 126 },
  },

  // Davao del Norte
  {
    id: "davao-del-norte",
    name: "Davao del Norte",
    tagline: "Nature's Paradise",
    icon: TreePine,
    color: "from-green-400 to-emerald-600",
    spots: [
      { name: "Camp Holiday Resort & Recreation Area", category: "Beach", lat: 7.1388, lng: 125.6866, image: "camp-holiday-resort-and-recreation-area.jpg" },
      { name: "Chemas by the Sea", category: "Beach", lat: 7.14, lng: 125.7, image: "chemas-by-the-sea.jpg" },
      { name: "Discovery Samal", category: "Beach", lat: 7.0678, lng: 125.7547, image: "discovery-samal.jpg" },
      { name: "Costa Azalea Crusoe Cabins", category: "Beach", lat: 7.06, lng: 125.75, image: "costa-azalea-crusoe-cabins.jpg" },
      { name: "Villa Amparo Garden Beach Resort", category: "Beach", lat: 7.055, lng: 125.758, image: "villa-amparo-garden-beach-resort.jpg" },
      { name: "Hof Gorei Beach Resort", category: "Beach", lat: 7.05, lng: 125.76, image: "hof-gorei-beach-resort.jpeg" },
      { name: "Tagum City Night Market", category: "City Tours", lat: 7.446, lng: 125.801, image: "tagum-city-night-market.jpg" },
      { name: "Monfort Bat Sanctuary", category: "Rural", lat: 7.466, lng: 125.814, image: "monfort-bat-sanctuary.jpg" },
      { name: "Hagimit Falls", category: "Rural", lat: 7.048, lng: 125.753, image: "hagimit-falls.jpg" },
    ],
    hotels: [
      { name: "Big 8 Corporate Hotel", image: "big-8-corporate-hotel.jpg" },
      { name: "Golden Palace Hotel", image: "golden-palace-hotel.jpg" },
      { name: "Citi Hotel Tagum", image: "citi-hotel-tagum.jpg" },
      { name: "Residencia Dara", image: "residencia-dara.jpg" },
      { name: "Rufinas Leisure Center Lakans Place", image: "rufinas-leisure-center-lakans-place.jpg" },
      { name: "Kojo Hotel Tagum", image: "kojo-hotel-tagum.jpg" },
      { name: "RedDoorz Queens Hometel", image: "reddoorz-queens-hometel.jpg" },
      { name: "Madonna Hometel & Suites", image: "madonna-hometel-and-suites.jpg" },
      { name: "Sena Gladyz Suites", image: "sena-gladyz-suites.jpg" },
      { name: "Twin Palm Guesthouse", image: "twin-palm-guesthouse.jpg" },
      { name: "Maria Clara Resort", image: "maria-clara-resort.jpg" },
      { name: "RGB Tourist Inn", image: "rgb-tourist-inn.jpg" },
      { name: "Tribal Homestays LGU Guesthouses", image: "tribal-homestays-lgu-guesthouses.jpg" },
    ],
    coordinates: { lat: 7.4, lng: 125.7 },
  },

  // Davao del Sur
  {
    id: "davao-del-sur",
    name: "Davao del Sur",
    tagline: "Cultural Heart",
    icon: Sun,
    color: "from-orange-400 to-red-600",
    spots: [
      { name: "Mt Apo", category: "Rural", lat: 6.9833, lng: 125.2667, image: "mt-apo.jpg" },
      { name: "Lake Venado", category: "Rural", lat: 6.9919, lng: 125.2789, image: "lake-venado.jpg" },
      { name: "Kapatagan Valley", category: "Rural", lat: 6.95, lng: 125.3, image: "kapatagan-valley.jpg" },
      { name: "Digos City Heritage Museum", category: "Cultural", lat: 6.752, lng: 125.364, image: "digos-city-heritage-museum.jpg" },
      { name: "Tboli Weaving Center", category: "Cultural", lat: 6.9, lng: 125.3, image: "tboli-weaving-center.jpg" },
      { name: "Apo View Deck", category: "City Tours", lat: 6.75, lng: 125.36, image: "apo-view-deck.jpg" },
      { name: "Dawis Beach", category: "Beach", lat: 6.74, lng: 125.32, image: "dawis-beach.jpg" },
      { name: "Pasig Islet Aqua-Eco Park", category: "Beach", lat: 6.73, lng: 125.33, image: "pasig-islet-aqua-eco-park.jpg" },
    ],
    hotels: [
      { name: "The Apo View Hotel", image: "the-apo-view-hotel.jpg" },
      { name: "Red Planet Davao", image: "red-planet-davao.jpg" },
      { name: "Asrodel Hotel RedPartner", image: "asrodel-hotel-redpartner.jpg" },
      { name: "Go Hotels Lanang Davao", image: "go-hotels-lanang-davao.jpg" },
      { name: "Hop Inn Davao", image: "hop-inn-davao.jpg" },
      { name: "Daylight Inn", image: "daylight-inn.jpg" },
      { name: "Hotel Galleria", image: "hotel-galleria.jpg" },
      { name: "Seda Abreeza Davao", image: "seda-abreeza-davao.jpg" },
      { name: "Grand Regal Hotel Davao", image: "grand-regal-hotel-davao.jpg" },
      { name: "Blue Lotus Hotel", image: "blue-lotus-hotel.jpg" },
      { name: "Acacia Hotel", image: "acacia-hotel.jpg" },
      { name: "Waterfront Insular Hotel", image: "waterfront-insular-hotel.jpg" },
      { name: "RedDoorz Plus", image: "reddoorz-plus.jpg" },
      { name: "Davao Central Suites", image: "davao-central-suites.jpg" },
      { name: "Hampton Suites", image: "hampton-suites.jpg" },
      { name: "Orchard Hotel", image: "orchard-hotel.jpg" },
      { name: "Avida Studio Leisure and Study Hub", image: "avida-studio-leisure-and-study-hub.jpg" },
      { name: "Park Avenue Residence Inn and Suites", image: "park-avenue-residence-inn-and-suites.jpg" },
    ],
    coordinates: { lat: 6.8, lng: 125.3 },
  },

  // Davao Occidental
  {
    id: "davao-occidental",
    name: "Davao Occidental",
    tagline: "Hidden Coastal Gems",
    icon: Waves,
    color: "from-cyan-400 to-blue-600",
    spots: [
      { name: "Malalag Bay", category: "Beach", lat: 5.9933, lng: 125.3667, image: "malalag-bay.jpg" },
      { name: "Cape San Agustin", category: "Beach", lat: 5.9, lng: 125.5333, image: "cape-san-agustin.jpg" },
      { name: "Balut Island", category: "Beach", lat: 5.95, lng: 125.5833, image: "balut-island.jpg" },
      { name: "Don Marcelino White Sand Beach", category: "Beach", lat: 5.7, lng: 125.55, image: "don-marcelino-white-sand-beach.jpg" },
      { name: "Sarangani Islands", category: "Rural", lat: 5.8, lng: 125.5, image: "sarangani-islands.jpg" },
    ],
    hotels: [
      { name: "Maldives Tubalan", image: "maldives-tubalan.jpg" },
      { name: "M-Square Pension House", image: "m-square-pension-house.jpg" },
      { name: "Linas Inn", image: "linas-inn.jpg" },
      { name: "Country Home Hotel", image: "country-home-hotel.jpg" },
      { name: "Paradiso Davao Beachfront Hotel & Resort", image: "paradiso-davao-beachfront-hotel-and-resort.jpg" },
      { name: "DDG Beach Resort", image: "ddg-beach-resort.jpg" },
      { name: "Splash Blue Beach Resort", image: "splash-blue-beach-resort.jpg" },
      { name: "Captains Lake Nature Resort", image: "captains-lake-nature-resort.jpg" },
      { name: "Arizona Beach Resort", image: "arizona-beach-resort.jpg" },
      { name: "Tuwang White Resort", image: "tuwang-white-resort.jpg" },
      { name: "JAS Travellers Inn", image: "jas-travellers-inn.jpg" },
      { name: "Tinaca Beach", image: "tinaca-beach.jpg" },
      { name: "Kings Royal Hotel & Leisure Park", image: "kings-royal-hotel-and-leisure-park.jpg" },
      { name: "Kabuntalan Beach Resort", image: "kabuntalan-beach-resort.jpg" },
      { name: "Hayahay Resort", image: "hayahay-resort.jpg" },
      { name: "Green State Suites", image: "green-state-suites.jpg" },
      { name: "Culaman Lighthouse", image: "culaman-lighthouse.jpg" },
      { name: "Sabang Hot Spring Resort", image: "sabang-hot-spring-resort.jpg" },
      { name: "5J Inn", image: "5j-inn.jpg" },
      { name: "Tuke Maklang Beach Resort", image: "tuke-maklang-beach-resort.jpg" },
      { name: "Ballistic Islet Island Resort", image: "ballistic-islet-island-resort.jpg" },
      { name: "Lanai Exclusive Resort", image: "lanai-exclusive-resort.jpg" },
      { name: "Gardenias del Alma Aurora Inn & Resort", image: "gardenias-del-alma-aurora-inn-and-resort.jpg" },
      { name: "Rosal Resort", image: "rosal-resort.jpg" },
      { name: "Delos Reyes Beach Resort", image: "delos-reyes-beach-resort.jpg" },
    ],
    coordinates: { lat: 6, lng: 125.5 },
  },

  // Davao Oriental
  {
    id: "davao-oriental",
    name: "Davao Oriental",
    tagline: "Sunrise Coast",
    icon: Compass,
    color: "from-sky-400 to-indigo-600",
    spots: [
      { name: "Dahican Beach", category: "Beach", lat: 6.9123, lng: 126.2201, image: "dahican-beach.jpg" },
      { name: "Aliwagwag Falls", category: "Rural", lat: 6.918, lng: 126.24, image: "aliwagwag-falls.jpg" },
      { name: "Pujada Bay", category: "Beach", lat: 6.92, lng: 126.25, image: "pujada-bay.jpg" },
      { name: "Sleeping Dinosaur Island", category: "Beach", lat: 6.915, lng: 126.23, image: "sleeping-dinosaur-island.jpg" },
      { name: "Mati City Cathedral", category: "Cultural", lat: 6.95, lng: 126.23, image: "mati-city-cathedral.jpg" },
      { name: "Governor Generoso Coastal Road", category: "City Tours", lat: 6.94, lng: 126.26, image: "governor-generoso-coastal-road.jpg" },
      { name: "Hijo Resorts", category: "Beach", lat: 6.925, lng: 126.24, image: "hijo-resorts.jpg" },
      { name: "Blue Bless Beach Resort", category: "Beach", lat: 6.926, lng: 126.235, image: "blue-bless-beach-resort.jpg" },
      { name: "Surf Up Resort", category: "Beach", lat: 6.93, lng: 126.225, image: "surf-up-resort.jpg" },
      { name: "Costa Celine Beach Resort", category: "Beach", lat: 6.935, lng: 126.22, image: "costa-celine-beach-resort.jpg" },
    ],
    hotels: [
      { name: "Adelina Hotel and Suites", image: "adelina-hotel-and-suites.jpg" },
      { name: "Senorita Suites Hotel Guesthouse", image: "senorita-suites-hotel-guesthouse.jpg" },
      { name: "Costa Celine Beach Resort", image: "costa-celine-beach-resort.jpg" },
      { name: "Daya Farm and Adventure", image: "daya-farm-and-adventure.jpg" },
    ],
    coordinates: { lat: 7.3, lng: 126.5 },
  },
];

// Helper function to filter spots by category
export const getSpotsByCategory = (province: Province, category: Category): Destination[] => {
  return province.spots.filter(spot => spot.category === category);
};

// Helper function to get all categories available in a province
export const getAvailableCategories = (province: Province): Category[] => {
  const categories = new Set(province.spots.map(spot => spot.category));
  return Array.from(categories);
};

// Helper function to count spots by category
export const countSpotsByCategory = (province: Province): Record<Category, number> => {
  return province.spots.reduce((acc, spot) => {
    acc[spot.category] = (acc[spot.category] || 0) + 1;
    return acc;
  }, {} as Record<Category, number>);
};

