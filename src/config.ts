import fs from "fs";
import os from "os";
import path from "path";

// Define the shape of our config object in camelCase
export type Config = {
  dbUrl: string;
  currentUserName?: string;
};

// --- Internal Helper Functions ---

function getConfigFilePath(): string {
  // os.homedir() safely gets the HOME directory across different OS platforms
  return path.join(os.homedir(), ".gatorconfig.json");
}

function validateConfig(rawConfig: any): Config {
  if (!rawConfig || typeof rawConfig !== "object") {
    throw new Error("Invalid config format. Expected an object.");
  }
  if (typeof rawConfig.db_url !== "string") {
    throw new Error("Invalid config: missing or malformed 'db_url'.");
  }

  // Map the snake_case JSON fields to camelCase Config properties
  return {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name,
  };
}

function writeConfig(cfg: Config): void {
  const filePath = getConfigFilePath();
  
  // Map the camelCase properties back to snake_case for the JSON file
  const fileData = {
    db_url: cfg.dbUrl,
    current_user_name: cfg.currentUserName,
  };

  // Stringify with a 2-space indent for prettified output
  fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2), {
    encoding: "utf-8",
  });
}

// --- Exported Functions ---

export function readConfig(): Config {
  const filePath = getConfigFilePath();
  
  try {
    const fileContent = fs.readFileSync(filePath, { encoding: "utf-8" });
    const rawConfig = JSON.parse(fileContent);
    return validateConfig(rawConfig);
  } catch (error) {
    throw new Error(`Failed to read config file at ${filePath}: ${error}`);
  }
}

export function setUser(username: string): void {
  // Read existing config, modify the user, and write it back
  const config = readConfig();
  config.currentUserName = username;
  writeConfig(config);
}