import { readConfig, setUser } from "./config.js";

function main() {
  const myName = "Lane"; // Replace with your actual name

  try {
    // 1. Set the current user and update the file on disk
    setUser(myName);
    console.log(`Config updated: user set to "${myName}"`);

    // 2. Read the config file back from disk
    const cfg = readConfig();

    // 3. Print the config object to the terminal
    console.log("Current Configuration:");
    console.log(cfg);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error("An unknown error occurred.");
    }
  }
}

main();
