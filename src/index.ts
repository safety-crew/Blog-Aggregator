import { readConfig, setUser } from "./config.js";
import {
  createUser,
  getUserByName,
  deleteAllUsers,
} from "./db/queries/users.js";

// 1. Define the CommandHandler type
type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

// 2. Define the CommandsRegistry type
interface CommandsRegistry {
  [key: string]: CommandHandler;
}

// 3. Create the login handler function
async function handlerLogin(cmdName: string, ...args: string[]): Promise<void> {
  if (args.length === 0) {
    throw new Error("The login command expects a username.");
  }

  const username = args[0];

  // Ensure the user exists before logging in
  const existingUser = await getUserByName(username);
  if (!existingUser) {
    throw new Error(`User doesn't exist: ${username}`);
  }

  setUser(username);
  console.log(`User has been set to: ${username}`);
}

// 4. Create the register handler function
async function handlerRegister(
  cmdName: string,
  ...args: string[]
): Promise<void> {
  if (args.length === 0) {
    throw new Error("The register command expects a username.");
  }

  const username = args[0];

  try {
    const user = await createUser(username);
    setUser(username);
    console.log(`User created successfully!`);
    console.log(user);
  } catch (error: any) {
    // Check if the error is a Postgres unique constraint violation
    if (error.code === "23505") {
      throw new Error(`User already exists: ${username}`);
    }
    // Re-throw any other unexpected errors
    throw error;
  }
}

// 5. Function to register a new command
function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler,
): void {
  registry[cmdName] = handler;
}

// 6. Function to run a command from the registry
async function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
): Promise<void> {
  const handler = registry[cmdName];
  if (!handler) {
    throw new Error(`Command not found: ${cmdName}`);
  }
  await handler(cmdName, ...args);
}

// Add the reset handler function
async function handlerReset(cmdName: string, ...args: string[]): Promise<void> {
  try {
    await deleteAllUsers();
    console.log("Database reset successfully! All users have been deleted.");
  } catch (error: any) {
    throw new Error(`Failed to reset database: ${error.message}`);
  }
}

async function main() {
  // Initialize the registry and register commands
  const commands: CommandsRegistry = {};
  registerCommand(commands, "login", handlerLogin);
  registerCommand(commands, "register", handlerRegister);
  registerCommand(commands, "reset", handlerReset); // Add this line

  // process.argv contains: [nodePath, scriptPath, cmdName, ...args]
  // We slice the first two to get only the CLI input
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error("Error: Not enough arguments provided.");
    process.exit(1);
  }

  const cmdName = args[0];
  const cmdArgs = args.slice(1);

  try {
    // Execute the command
    await runCommand(commands, cmdName, ...cmdArgs);
    process.exit(0);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error("An unknown error occurred.");
    }
    process.exit(1);
  }
}

main();
