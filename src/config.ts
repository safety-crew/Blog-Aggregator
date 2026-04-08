import fs from "fs";
import os from "os";
import path from "path";

const CONFIG_FILE_NAME = ".gatorconfig.json";

export interface Config {
  dbUrl: string;
  currentUserName?: string;
}

/**
 * Returns the absolute path to the .gatorconfig.json file in the user's home directory.
 */
function getConfigFilePath(): string {
  return path.join(os.homedir(), CONFIG_FILE_NAME);
}

/**
 * Writes the Config object to the JSON file, mapping camelCase to snake_case.
 */
function writeConfig(cfg: Config): void {
  const filePath = getConfigFilePath();
  const data = JSON.stringify(
    {
      db_url: cfg.dbUrl,
      current_user_name: cfg.currentUserName,
    },
    null,
    2,
  ); // Prettify with 2-space indentation
  fs.writeFileSync(filePath, data, "utf-8");
}

/**
 * Validates the raw JSON object and maps snake_case keys back to the camelCase Config type.
 */
function validateConfig(rawConfig: any): Config {
  if (!rawConfig.db_url) {
    throw new Error("Invalid config: 'db_url' is required.");
  }
  return {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name,
  };
}

/**
 * Reads the config file from the home directory and returns a Config object.
 */
export function readConfig(): Config {
  const filePath = getConfigFilePath();
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const rawConfig = JSON.parse(fileContent);
    return validateConfig(rawConfig);
  } catch (err) {
    throw new Error(
      `Could not read config file at ${filePath}. Make sure it exists and contains valid JSON.`,
    );
  }
}

/**
 * Updates the current_user_name in the config file.
 */
export function setUser(username: string): void {
  const cfg = readConfig();
  cfg.currentUserName = username;
  writeConfig(cfg);
}
