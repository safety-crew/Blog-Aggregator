import { readConfig, setUser } from "./config.js";

function main() {
  console.log("Starting Gator...");

  // Set the current user (replace "Lane" with your actual name)
  setUser("Lane");

  // Read the config file again and parse it into an object
  const currentConfig = readConfig();

  // Print the resulting config to the terminal
  console.log("\nCurrent Configuration:");
  console.log(currentConfig);
}

main();