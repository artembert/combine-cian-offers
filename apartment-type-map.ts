import * as chalk from "chalk";
import { consoleLog } from "./index";

export const apartmentTypeMap: Map<string, string> = new Map<string, string>([
  ["1", "oneRoom"],
  ["2", "twoRoom"],
  ["3", "threeRoom"],
  ["0", "studioApartment"],
]);

export function defineApartmentType() {
  const [userInput] = process.argv.slice(2);
  if (!userInput) {
    consoleLog(
      chalk.red(
        `Please define rooms count: ${[...apartmentTypeMap.keys()].toString()}`
      )
    );
    process.exit(0);
  }
  const selectedType = apartmentTypeMap.get(userInput);
  if (selectedType === undefined) {
    consoleLog(
      chalk.red(
        `Please define rooms count: ${[...apartmentTypeMap.keys()].toString()}`
      )
    );
    process.exit(1);
  }
  global["apartmentType"] = selectedType;
}
