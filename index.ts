import * as path from "path";
import { promises } from "fs";
import { getFileNamesFromFolder } from "./src/files/get-file-names-from-folder";
import { SimplifyOffer } from "./src/interfaces/simplify-offer";
import { srcPaths } from "./src/files/paths";

(async () => await mergeOffers())();

export async function mergeOffers() {
  global["appRoot"] = path.resolve(__dirname);

  const combinedOffers: SimplifyOffer[] = [];
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
        process.exit(1);
        return;
      }
      console.log(`\nOffer with ID [${newOffer.id}] added to common list`);
      combinedOffers.push(newOffer);
    });
  }
}

function getExistingOffer(
  combinedOffers: SimplifyOffer[],
  newOffer: SimplifyOffer
): SimplifyOffer | undefined {
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
