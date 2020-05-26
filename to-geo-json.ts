import { defineApartmentType } from "./apartment-type-map";
import * as path from "path";
import { convertOffersToGeoJSON } from "./index";

(async () => {
  global["appRoot"] = path.resolve(__dirname);
  defineApartmentType();
  await convertOffersToGeoJSON();
})();
