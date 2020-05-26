const srcPaths = {
  oneRoom: "src-data/sale/1-room",
  twoRoom: "src-data/sale/2-room",
  threeRoom: "src-data/sale/3-room",
  studioApartment: "src-data/sale/studio-apartment",
};

const distPath = {
  oneRoom: "dist-data/sale/1-room",
  twoRoom: "dist-data/sale/2-room",
  threeRoom: "dist-data/sale/3-room",
  studioApartment: "dist-data/sale/studio-apartment",
};

const distFileNames = {
  oneRoom: "1-room.json",
  twoRoom: "2-room.json",
  threeRoom: "3-room.json",
  studioApartment: "studio-apartment.json",
};

const distGeoJSONFileNames = {
  oneRoom: "1-room.geojson",
  twoRoom: "2-room.geojson",
  threeRoom: "3-room.geojson",
  studioApartment: "studio-apartment.geojson",
};

function getDefinedApartmentType(): string {
  return global["apartmentType"];
}

export function getSrcPaths(): string {
  return srcPaths[getDefinedApartmentType()];
}

export function getDistPath(): string {
  return distPath[getDefinedApartmentType()];
}

export function getDistFileNames(): string {
  return distFileNames[getDefinedApartmentType()];
}

export function getDistGeoJSONFileNames(): string {
  return distGeoJSONFileNames[getDefinedApartmentType()];
}
