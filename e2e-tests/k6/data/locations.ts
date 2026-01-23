import { FromAddressType, FromLocationType, ToLocationType } from '../types';

export const getFromLocation = (): FromLocationType => {
  return fromLocations[Math.floor(Math.random() * fromLocations.length)];
};

export const getFromAddress = (): FromAddressType => {
  return fromAddresses[Math.floor(Math.random() * fromAddresses.length)];
};

export const getFromLocationName = (): string => {
  return fromLocations[Math.floor(Math.random() * fromLocations.length)].name;
};

export const getToLocationName = (): string => {
  return toLocations[Math.floor(Math.random() * toLocations.length)].name;
};

export const getToLocationRegionName = (): string => {
  return toLocationsRegion[Math.floor(Math.random() * toLocationsRegion.length)]
    .name;
};

const fromLocations: FromLocationType[] = [
  {
    name: 'Olav Tryggvasons gate',
    quay: '1',
  },
  {
    name: 'Prinsens gate',
    quay: 'P1',
  },
  {
    name: 'Klettkrysset',
    quay: '1',
  },
  {
    name: 'Dronningens gate',
    quay: 'D1',
  },
  {
    name: 'Tillerterminalen',
    quay: '1',
  },
];

const toLocations: ToLocationType[] = [
  {
    name: 'Melhus sentrum',
  },
  {
    name: 'Stjørdal stasjon',
  },
  {
    name: 'Husebytunet',
  },
  {
    name: 'Lade idrettsanlegg',
  },
  {
    name: 'Ranheim idrettsplass',
  },
];

const toLocationsRegion: ToLocationType[] = [
  {
    name: 'Namsos skysstasjon',
  },
  {
    name: 'Meråker sentrum',
  },
  {
    name: 'Hitra idrettspark',
  },
  {
    name: 'Berkåk sentrum',
  },
  {
    name: 'Selbu skysstasjon',
  },
];

const fromAddresses: FromAddressType[] = [
  {
    name: 'Nidarosdomen',
    nearbyStopPlace: 'Nidarosdomen',
  },
  {
    name: 'Prinsens gate',
    nearbyStopPlace: 'Prinsens gate',
  },
  {
    name: 'Melhus',
    nearbyStopPlace: 'Melhus skysstasjon',
  },
  {
    name: 'Dronningens gate',
    nearbyStopPlace: 'Dronningens gate',
  },
  {
    name: 'Trondheim Torg',
    nearbyStopPlace: 'Kongens gate',
  },
];
