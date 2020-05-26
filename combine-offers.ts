import { mergeOffers } from "./index";
import { defineApartmentType } from "./apartment-type-map";

(async () => {
  defineApartmentType();
  await mergeOffers();
})();
