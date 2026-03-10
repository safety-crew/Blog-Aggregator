import { setUser } from "./config.js";

// --- Types ---

// A CommandHandler takes the command name and an array of string arguments
type CommandHandler = (cmdName: string, ...args: string[]) => void;

// CommandsRegistry is an object mapping command strings to their handlers
type CommandsRegistry = Record<string, CommandHandler>;

// --- Registry Functions ---

function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler): void {
  registry[cmdName] = handler;
}

function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]): void {
  const handler = registry[cmdName];
  if (!handler) {
    throw new Error(`Command not found: ${cmdName}`);
  }
  
  // Execute the matched handler
  handler(cmdName, ...args);
}

// --- Command Handlers ---

function handlerLogin(cmdName: string, ...args: string[]): void {
  // The login command requires exactly one argument: the username
  if (args.length === 0) {
    throw new Error("The login command requires a username argument.");
  }

  const username = args[0];
  
  // Set the user in the config file
  setUser(username);
  
  // Print success message to standard output
  console.log(`User has been set to: ${username}`);
}

// --- Main Application ---

function main() {
  // 1. Initialize the registry and register commands
  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", handlerLogin);

  // 2. Parse command-line arguments
  // process.argv[0] is the Node binary
  // process.argv[1] is the script path
  // process.argv[2...] are the actual CLI arguments
  const cliArgs = process.argv.slice(2);

  // 3. Ensure a command was provided
  if (cliArgs.length === 0) {
    console.error("Error: Not enough arguments provided. Please specify a command.");
    process.exit(1);
  }

  // 4. Extract the command name and its parameters
  const cmdName = cliArgs[0];
  const cmdArgs = cliArgs.slice(1);

  // 5. Run the command and handle potential errors gracefully
  try {
    runCommand(registry, cmdName, ...cmdArgs);
  } catch (error: any) {
    // Print the error to standard error and exit with a non-zero status code
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();