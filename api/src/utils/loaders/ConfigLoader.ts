
import * as yaml from "js-yaml";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { config } from "../..";
/**
 * Load the configs from a yaml file
 * @param directory - string
 */

export function ConfigLoader(filename: string): object | any {

    const directory_path = path.join("../config", filename);
    const directory_file = fs.readFileSync(directory_path, 'utf8');
    const config = yaml.load(directory_file);

    return config;

}
