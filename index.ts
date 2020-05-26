import * as path from "path";
import { promises } from "fs";
import { getFileNamesFromFolder } from "./src/files/get-file-names-from-folder";
import {
  SimplifyOffer,
  SimplifyOfferWithHistory,
} from "./src/interfaces/simplify-offer";
import { distFileNames, distPath, srcPaths } from "./src/files/paths";

(async () => await mergeOffers())();

export async function mergeOffers() {
  global["appRoot"] = path.resolve(__dirname);

  const combinedOffers: SimplifyOfferWithHistory[] = [];
  const fileNames = await getFileNamesFromFolder();
  for (const fileName of fileNames) {
    const srcFileOffers = JSON.parse(
      await promises.readFile(
        path.join(global["appRoot"], srcPaths.singleRoom, fileName),
        { encoding: "utf-8" }
      )
    ) as SimplifyOffer[];
    srcFileOffers.forEach((newOffer) => {
      const existingOffer = getExistingOffer(combinedOffers, newOffer);
      if (existingOffer !== undefined) {
        console.error(
          `\nDuplicate: 
          existing offer ID: ${existingOffer.id},
          new offer ID: ${newOffer.id}\n`
        );
        fillHistory(existingOffer, newOffer);
      } else {
        console.log(`\nOffer with ID [${newOffer.id}] added to common list`);
        combinedOffers.push(addHistoryToOffer(newOffer));
      }
    });
  }
  await saveCombinedOffers(combinedOffers);
  process.exit(0);
}

function getExistingOffer(
  combinedOffers: SimplifyOfferWithHistory[],
  newOffer: SimplifyOffer
): SimplifyOfferWithHistory | undefined {
  return combinedOffers.find((offerFromCommonList) => {
    return (
      offerFromCommonList.id === newOffer.id ||
      (offerFromCommonList.latitude === newOffer.latitude &&
        offerFromCommonList.longitude === newOffer.longitude &&
        offerFromCommonList.total_area === newOffer.total_area &&
        offerFromCommonList.floor === newOffer.floor &&
        offerFromCommonList.floors_count === offerFromCommonList.floors_count)
    );
  });
}

function fillHistory(
  existingOffer: SimplifyOfferWithHistory,
  newOffer: SimplifyOffer
): void {
  existingOffer.history.push({
    updatedDate: getPriceDate(newOffer),
    price: newOffer.price,
  });
}

async function saveCombinedOffers(combinedOffers: SimplifyOfferWithHistory[]) {
  await promises.writeFile(
    path.join(global["appRoot"], distPath.singleRoom, distFileNames.singleRoom),
    JSON.stringify(combinedOffers, undefined, 2),
    { encoding: "utf8" }
  );
}

function addHistoryToOffer(newOffer: SimplifyOffer): SimplifyOfferWithHistory {
  newOffer["history"] = [];
  newOffer["history"].push({
    updatedDate: getPriceDate(newOffer),
    price: newOffer.price,
  });
  delete newOffer.price;
  delete newOffer.date;
  return newOffer;
}

function getPriceDate(offer: SimplifyOffer): string {
  const timeStamp = !isNaN(Date.parse(offer.date))
    ? Date.parse(offer.date)
    : offer.download_date || undefined;
  return new Date(timeStamp).toISOString();
}
