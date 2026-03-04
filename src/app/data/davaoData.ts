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

export interface Activity {
  id: string;
  label: string;
  emoji: string;
  category: "Water" | "Nature" | "Culture" | "Adventure" | "Leisure" | "Food";
}

export interface Province {
  id: string;
  name: string;
  tagline: string;
  icon: any;
  color: string;
  spots: Destination[];
  hotels: Hotel[];
  activities: Activity[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const davaoCityCategories: Category[] = ["Beach", "Rural", "City Tours", "Cultural"];

const davaoDeOroActivities: Activity[] = [
  { id: "swimming", label: "Swimming", emoji: "🏊", category: "Water" },
  { id: "island-exploration", label: "Island Exploration", emoji: "🏝️", category: "Adventure" },
  { id: "infinity-pool", label: "Infinity Pool", emoji: "💦", category: "Leisure" },
  { id: "water-slides", label: "Water Slides", emoji: "🌊", category: "Water" },
  { id: "team-building", label: "Team Building", emoji: "🤝", category: "Leisure" },
  { id: "dining", label: "Dining", emoji: "🍽️", category: "Food" },
  { id: "overnight-stays", label: "Overnight Stays", emoji: "🌙", category: "Leisure" },
  { id: "leisure-walks", label: "Leisure Walks", emoji: "🚶", category: "Leisure" },
  { id: "local-gatherings", label: "Local Gatherings", emoji: "👥", category: "Culture" },
  { id: "sightseeing", label: "Sightseeing", emoji: "👀", category: "Leisure" },
  { id: "photography", label: "Photography", emoji: "📸", category: "Leisure" },
  { id: "hiking", label: "Hiking", emoji: "🥾", category: "Adventure" },
  { id: "picnicking", label: "Picnicking", emoji: "🧺", category: "Leisure" },
  { id: "camping", label: "Camping", emoji: "⛺", category: "Adventure" },
  { id: "bamboo-rafting", label: "Bamboo Rafting", emoji: "🛶", category: "Water" },
  { id: "kayaking", label: "Kayaking", emoji: "🚣", category: "Water" },
  { id: "trekking", label: "Trekking", emoji: "🏔️", category: "Adventure" },
  { id: "relaxation", label: "Relaxation", emoji: "😌", category: "Leisure" },
  { id: "mountain-climbing", label: "Mountain Climbing", emoji: "🧗", category: "Adventure" },
  { id: "sunset-viewing", label: "Sunset Viewing", emoji: "🌅", category: "Leisure" },
];

const davaDelNorteActivities: Activity[] = [
  { id: "swimming", label: "Swimming", emoji: "🏊", category: "Water" },
  { id: "sunbathing", label: "Sunbathing", emoji: "☀️", category: "Leisure" },
  { id: "picnicking", label: "Picnicking", emoji: "🧺", category: "Leisure" },
  { id: "kayaking", label: "Kayaking", emoji: "🚣", category: "Water" },
  { id: "snorkeling", label: "Snorkeling", emoji: "🤿", category: "Water" },
  { id: "beach-camping", label: "Beach Camping", emoji: "⛺", category: "Adventure" },
  { id: "scuba-diving", label: "Scuba Diving", emoji: "🌊", category: "Water" },
  { id: "island-hopping", label: "Island Hopping", emoji: "🏝️", category: "Adventure" },
  { id: "skimboarding", label: "Skimboarding", emoji: "🏄", category: "Water" },
  { id: "banana-boat", label: "Banana Boat", emoji: "🍌", category: "Water" },
  { id: "stand-up-paddleboard", label: "Stand-Up Paddleboard", emoji: "🏄‍♂️", category: "Water" },
  { id: "river-cruise", label: "River Cruise", emoji: "🛥️", category: "Water" },
  { id: "forest-tour", label: "Forest Tour", emoji: "🌲", category: "Nature" },
  { id: "plantation-tour", label: "Plantation Tour", emoji: "🌿", category: "Nature" },
  { id: "twilight-safari", label: "Twilight Safari", emoji: "🦇", category: "Nature" },
  { id: "fishing", label: "Fishing", emoji: "🎣", category: "Leisure" },
  { id: "biking", label: "Biking", emoji: "🚴", category: "Adventure" },
  { id: "horseback-riding", label: "Horseback Riding", emoji: "🐴", category: "Adventure" },
  { id: "cliff-diving", label: "Cliff Diving", emoji: "🪂", category: "Adventure" },
  { id: "beach-walks", label: "Beach Walks", emoji: "🚶‍♀️", category: "Leisure" },
  { id: "cultural-shows", label: "Cultural Shows", emoji: "🎭", category: "Culture" },
  { id: "diving", label: "Diving", emoji: "🤽", category: "Water" },
  { id: "sandbar-walking", label: "Sandbar Walking", emoji: "👣", category: "Leisure" },
  { id: "outdoor-recreation", label: "Outdoor Recreation", emoji: "🏕️", category: "Adventure" },
  { id: "shopping", label: "Shopping", emoji: "🛍️", category: "Leisure" },
  { id: "walking-tours", label: "Walking Tours", emoji: "🗺️", category: "Culture" },
  { id: "historical-appreciation", label: "Historical Appreciation", emoji: "🏛️", category: "Culture" },
  { id: "sunset-viewing", label: "Sunset Viewing", emoji: "🌅", category: "Leisure" },
  { id: "photography", label: "Photography", emoji: "📸", category: "Leisure" },
  { id: "dining", label: "Dining", emoji: "🍽️", category: "Food" },
];

const davaoDelSurActivities: Activity[] = [
  { id: "swimming", label: "Swimming", emoji: "🏊", category: "Water" },
  { id: "eco-tours", label: "Eco-Tours", emoji: "🌿", category: "Nature" },
  { id: "kayaking", label: "Kayaking", emoji: "🚣", category: "Water" },
  { id: "boating", label: "Boating", emoji: "🛥️", category: "Water" },
  { id: "scenic-viewing", label: "Scenic Viewing", emoji: "🏔️", category: "Leisure" },
  { id: "photography", label: "Photography", emoji: "📸", category: "Leisure" },
  { id: "relaxation", label: "Relaxation", emoji: "😌", category: "Leisure" },
  { id: "picnicking", label: "Picnicking", emoji: "🧺", category: "Leisure" },
  { id: "meditation", label: "Meditation", emoji: "🧘", category: "Leisure" },
  { id: "waterfront-strolling", label: "Waterfront Strolling", emoji: "🚶", category: "Leisure" },
  { id: "jogging", label: "Jogging", emoji: "🏃", category: "Adventure" },
  { id: "dining", label: "Dining", emoji: "🍽️", category: "Food" },
  { id: "shopping", label: "Shopping", emoji: "🛍️", category: "Leisure" },
  { id: "butterfly-watching", label: "Butterfly Watching", emoji: "🦋", category: "Nature" },
  { id: "guided-tours", label: "Guided Tours", emoji: "🗺️", category: "Culture" },
  { id: "street-food", label: "Street Food", emoji: "🍢", category: "Food" },
  { id: "historical-learning", label: "Historical Learning", emoji: "📜", category: "Culture" },
  { id: "cultural-appreciation", label: "Cultural Appreciation", emoji: "🏺", category: "Culture" },
  { id: "bird-watching", label: "Bird Watching", emoji: "🦅", category: "Nature" },
  { id: "museum-tours", label: "Museum Tours", emoji: "🏛️", category: "Culture" },
  { id: "hiking", label: "Hiking", emoji: "🥾", category: "Adventure" },
  { id: "nature-trekking", label: "Nature Trekking", emoji: "🏕️", category: "Adventure" },
  { id: "summit-climbing", label: "Summit Climbing", emoji: "🧗", category: "Adventure" },
  { id: "prayer-reflection", label: "Prayer & Reflection", emoji: "🙏", category: "Leisure" },
  { id: "garden-walking", label: "Garden Walking", emoji: "🌸", category: "Nature" },
  { id: "skating", label: "Skating", emoji: "⛸️", category: "Adventure" },
  { id: "art-installations", label: "Art Installations", emoji: "🎨", category: "Culture" },
  { id: "religious-visits", label: "Religious Visits", emoji: "⛪", category: "Culture" },
  { id: "campus-walks", label: "Campus Walks", emoji: "🏫", category: "Leisure" },
];

const davaoOccidentalActivities: Activity[] = [
  { id: "volcano-trekking", label: "Volcano Trekking", emoji: "🌋", category: "Adventure" },
  { id: "island-hopping", label: "Island Hopping", emoji: "🏝️", category: "Adventure" },
  { id: "caving", label: "Caving", emoji: "🦇", category: "Adventure" },
  { id: "beach-relaxation", label: "Beach Relaxation", emoji: "🏖️", category: "Leisure" },
  { id: "sunrise-viewing", label: "Sunrise Viewing", emoji: "🌄", category: "Leisure" },
  { id: "fishing-boating", label: "Fishing & Boating", emoji: "🎣", category: "Leisure" },
  { id: "camping", label: "Camping", emoji: "⛺", category: "Adventure" },
  { id: "cycling-jogging", label: "Cycling & Jogging", emoji: "🚴", category: "Adventure" },
  { id: "food-trips", label: "Food Trips", emoji: "🍽️", category: "Food" },
  { id: "photography", label: "Photography", emoji: "📸", category: "Leisure" },
  { id: "swimming", label: "Swimming", emoji: "🏊", category: "Water" },
  { id: "coves-exploration", label: "Coves Exploration", emoji: "🗺️", category: "Adventure" },
  { id: "nature-walks", label: "Nature Walks", emoji: "🌿", category: "Nature" },
  { id: "cultural-tours", label: "Cultural Tours", emoji: "🏺", category: "Culture" },
  { id: "heritage-appreciation", label: "Heritage Appreciation", emoji: "🏛️", category: "Culture" },
  { id: "leisure-walks", label: "Leisure Walks", emoji: "🚶", category: "Leisure" },
  { id: "family-activities", label: "Family Activities", emoji: "👨‍👩‍👧", category: "Leisure" },
  { id: "sightseeing", label: "Sightseeing", emoji: "👀", category: "Leisure" },
  { id: "lagoon-visits", label: "Lagoon Visits", emoji: "💦", category: "Water" },
];

const davaoOrientalActivities: Activity[] = [
  { id: "surfing", label: "Surfing", emoji: "🏄", category: "Water" },
  { id: "dolphin-watching", label: "Dolphin Watching", emoji: "🐬", category: "Nature" },
  { id: "turtle-conservation", label: "Turtle Conservation", emoji: "🐢", category: "Nature" },
  { id: "sunrise-viewing", label: "Sunrise Viewing", emoji: "🌄", category: "Leisure" },
  { id: "mangrove-walking", label: "Mangrove Walking", emoji: "🌳", category: "Nature" },
  { id: "hot-spring-bathing", label: "Hot Spring Bathing", emoji: "♨️", category: "Leisure" },
  { id: "cold-river-dip", label: "Cold River Dip", emoji: "🏊", category: "Water" },
  { id: "lighthouse-climbing", label: "Lighthouse Climbing", emoji: "🗼", category: "Adventure" },
  { id: "island-hopping", label: "Island Hopping", emoji: "🏝️", category: "Adventure" },
  { id: "snorkeling", label: "Snorkeling", emoji: "🤿", category: "Water" },
  { id: "skimboarding", label: "Skimboarding", emoji: "🏄‍♀️", category: "Water" },
  { id: "camping", label: "Camping", emoji: "⛺", category: "Adventure" },
  { id: "hammock-lounging", label: "Hammock Lounging", emoji: "🛌", category: "Leisure" },
  { id: "coral-reef-exploration", label: "Coral Reef Exploration", emoji: "🪸", category: "Nature" },
  { id: "cliff-exploration", label: "Cliff Exploration", emoji: "🧗", category: "Adventure" },
  { id: "hiking-trekking", label: "Hiking / Trekking", emoji: "🥾", category: "Adventure" },
  { id: "photography", label: "Photography", emoji: "📸", category: "Leisure" },
  { id: "cultural-immersion", label: "Cultural Immersion", emoji: "🎭", category: "Culture" },
  { id: "museum-tours", label: "Museum Tours", emoji: "🏛️", category: "Culture" },
  { id: "zipline", label: "Zipline Ride", emoji: "🪂", category: "Adventure" },
  { id: "monkey-bridge", label: "Monkey Bridge", emoji: "🌉", category: "Adventure" },
  { id: "bird-watching", label: "Bird Watching", emoji: "🦅", category: "Nature" },
  { id: "cliff-diving", label: "Cliff Diving", emoji: "🏊‍♂️", category: "Adventure" },
  { id: "river-trekking", label: "River Trekking", emoji: "🏞️", category: "Adventure" },
  { id: "rafting", label: "Rafting", emoji: "🛶", category: "Water" },
  { id: "mini-canyoneering", label: "Mini-Canyoneering", emoji: "🏔️", category: "Adventure" },
  { id: "jogging", label: "Jogging", emoji: "🏃", category: "Adventure" },
  { id: "meditation", label: "Meditation", emoji: "🧘", category: "Leisure" },
  { id: "church-tours", label: "Church Tours", emoji: "⛪", category: "Culture" },
];

export const provinces: Province[] = [
  // Davao de Oro
  {
    id: "davao-de-oro",
    name: "Davao de Oro",
    tagline: "Golden Adventures Await",
    icon: Mountain,
    color: "from-yellow-400 to-amber-600",
    activities: davaoDeOroActivities,
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
    activities: davaDelNorteActivities,
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
    activities: davaoDelSurActivities,
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
    activities: davaoOccidentalActivities,
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
    activities: davaoOrientalActivities,
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