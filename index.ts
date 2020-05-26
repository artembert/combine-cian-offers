import * as path from "path";
import { promises } from "fs";
import { getFileNamesFromFolder } from "./src/files/get-file-names-from-folder";
import {
  SimplifyOffer,
  SimplifyOfferWithHistory,
} from "./src/interfaces/simplify-offer";
import * as chalk from "chalk";
import { getDistFileNames, getDistPath, getSrcPaths } from "./src/files/paths";

export async function mergeOffers() {
  global["appRoot"] = path.resolve(__dirname);

  const combinedOffers: SimplifyOfferWithHistory[] = [];
  const fileNames = await getFileNamesFromFolder();
  for (const [fileIndex, fileName] of fileNames.entries()) {
    const srcFileOffers = JSON.parse(
      await promises.readFile(
        path.join(global["appRoot"], getSrcPaths(), fileName),
        { encoding: "utf-8" }
      )
    ) as SimplifyOffer[];
    const srcFileOffersLength = srcFileOffers.length;
    consoleLog(
      chalk.blue(
        `\n[${fileIndex + 1}/${
          fileNames.length
        }] File: ${fileName} contains ${srcFileOffersLength} offers`
      )
    );
    srcFileOffers.forEach((newOffer, index) => {
      const existingOffer = getExistingOffer(combinedOffers, newOffer);
      if (existingOffer !== undefined) {
        consoleLog(
          chalk.yellow(
            `[${
              index + 1
            }/${srcFileOffersLength}] Duplicate: existing offer ID: ${
              existingOffer.id
            }, new offer ID: ${newOffer.id}`
          )
        );
        fillHistory(existingOffer, newOffer);
      } else {
        consoleLog(
          chalk.white(`Offer with ID [${newOffer.id}] added to common list`)
        );
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
  const fileDist = path.join(
    global["appRoot"],
    getDistPath(),
    getDistFileNames()
  );
  await promises.writeFile(
    fileDist,
    JSON.stringify(combinedOffers, undefined, 2),
    { encoding: "utf8" }
  );
  consoleLog(
    chalk.green(`${combinedOffers.length} combined offers saver to ${fileDist}`)
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

export function consoleLog(content: any): void {
  const dateNow = new Date();
  console.log(
    `[${
      dateNow.getHours() + 1
    }:${dateNow.getMinutes()}:${dateNow.getSeconds()}.${dateNow.getMilliseconds()}] ${content}`
  );
}
