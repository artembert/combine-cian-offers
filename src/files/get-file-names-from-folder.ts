import { srcPaths } from "./paths";
import { promises } from "fs";
import * as path from "path";

export async function getFileNamesFromFolder(): Promise<string[]> {
  return promises.readdir(path.join(global["appRoot"], srcPaths.oneRoom));
}
