export enum TransportMode {
  AIR = 'air',
  BUS = 'bus',
  METRO = 'metro',
  RAIL = 'rail',
  TRAM = 'tram',
  COACH = 'coach',
  WATER = 'water',
  UNKNOWN = 'unknown',
}

export enum TransportSubmode {
  SchengenAreaFlight = 'SchengenAreaFlight',
  AirportBoatLink = 'airportBoatLink',
  AirportLinkBus = 'airportLinkBus',
  AirportLinkRail = 'airportLinkRail',
  AirshipService = 'airshipService',
  AllFunicularServices = 'allFunicularServices',
  AllHireVehicles = 'allHireVehicles',
  AllTaxiServices = 'allTaxiServices',
  BikeTaxi = 'bikeTaxi',
  BlackCab = 'blackCab',
  CableCar = 'cableCar',
  CableFerry = 'cableFerry',
  CanalBarge = 'canalBarge',
  CarTransportRailService = 'carTransportRailService',
  ChairLift = 'chairLift',
  CharterTaxi = 'charterTaxi',
  CityTram = 'cityTram',
  CommunalTaxi = 'communalTaxi',
  CommuterCoach = 'commuterCoach',
  CrossCountryRail = 'crossCountryRail',
  DedicatedLaneBus = 'dedicatedLaneBus',
  DemandAndResponseBus = 'demandAndResponseBus',
  DomesticCharterFlight = 'domesticCharterFlight',
  DomesticFlight = 'domesticFlight',
  DomesticScheduledFlight = 'domesticScheduledFlight',
  DragLift = 'dragLift',
  ExpressBus = 'expressBus',
  Funicular = 'funicular',
  HelicopterService = 'helicopterService',
  HighFrequencyBus = 'highFrequencyBus',
  HighSpeedPassengerService = 'highSpeedPassengerService',
  HighSpeedRail = 'highSpeedRail',
  HighSpeedVehicleService = 'highSpeedVehicleService',
  HireCar = 'hireCar',
  HireCycle = 'hireCycle',
  HireMotorbike = 'hireMotorbike',
  HireVan = 'hireVan',
  IntercontinentalCharterFlight = 'intercontinentalCharterFlight',
  IntercontinentalFlight = 'intercontinentalFlight',
  International = 'international',
  InternationalCarFerry = 'internationalCarFerry',
  InternationalCharterFlight = 'internationalCharterFlight',
  InternationalCoach = 'internationalCoach',
  InternationalFlight = 'internationalFlight',
  InternationalPassengerFerry = 'internationalPassengerFerry',
  InterregionalRail = 'interregionalRail',
  Lift = 'lift',
  Local = 'local',
  LocalBus = 'localBus',
  LocalCarFerry = 'localCarFerry',
  LocalPassengerFerry = 'localPassengerFerry',
  LocalTram = 'localTram',
  LongDistance = 'longDistance',
  Metro = 'metro',
  MiniCab = 'miniCab',
  MobilityBus = 'mobilityBus',
  MobilityBusForRegisteredDisabled = 'mobilityBusForRegisteredDisabled',
  NationalCarFerry = 'nationalCarFerry',
  NationalCoach = 'nationalCoach',
  NationalPassengerFerry = 'nationalPassengerFerry',
  NightBus = 'nightBus',
  NightRail = 'nightRail',
  PostBoat = 'postBoat',
  PostBus = 'postBus',
  RackAndPinionRailway = 'rackAndPinionRailway',
  RailReplacementBus = 'railReplacementBus',
  RailShuttle = 'railShuttle',
  RailTaxi = 'railTaxi',
  RegionalBus = 'regionalBus',
  RegionalCarFerry = 'regionalCarFerry',
  RegionalCoach = 'regionalCoach',
  RegionalPassengerFerry = 'regionalPassengerFerry',
  RegionalRail = 'regionalRail',
  RegionalTram = 'regionalTram',
  ReplacementRailService = 'replacementRailService',
  RiverBus = 'riverBus',
  RoadFerryLink = 'roadFerryLink',
  RoundTripCharterFlight = 'roundTripCharterFlight',
  ScheduledFerry = 'scheduledFerry',
  SchoolAndPublicServiceBus = 'schoolAndPublicServiceBus',
  SchoolBoat = 'schoolBoat',
  SchoolBus = 'schoolBus',
  SchoolCoach = 'schoolCoach',
  ShortHaulInternationalFlight = 'shortHaulInternationalFlight',
  ShuttleBus = 'shuttleBus',
  ShuttleCoach = 'shuttleCoach',
  ShuttleFerryService = 'shuttleFerryService',
  ShuttleFlight = 'shuttleFlight',
  ShuttleTram = 'shuttleTram',
  SightseeingBus = 'sightseeingBus',
  SightseeingCoach = 'sightseeingCoach',
  SightseeingFlight = 'sightseeingFlight',
  SightseeingService = 'sightseeingService',
  SightseeingTram = 'sightseeingTram',
  SleeperRailService = 'sleeperRailService',
  SpecialCoach = 'specialCoach',
  SpecialNeedsBus = 'specialNeedsBus',
  SpecialTrain = 'specialTrain',
  StreetCableCar = 'streetCableCar',
  SuburbanRailway = 'suburbanRailway',
  Telecabin = 'telecabin',
  TelecabinLink = 'telecabinLink',
  TouristCoach = 'touristCoach',
  TouristRailway = 'touristRailway',
  TrainFerry = 'trainFerry',
  TrainTram = 'trainTram',
  Tube = 'tube',
  Undefined = 'undefined',
  UndefinedFunicular = 'undefinedFunicular',
  Unknown = 'unknown',
  UrbanRailway = 'urbanRailway',
  WaterTaxi = 'waterTaxi',
}

export type TransportModeGroup = {
  subMode?: TransportSubmode;
  mode: TransportMode;
};