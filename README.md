# Blog Aggregator CLI

This project is a Command Line Interface (CLI) tool for managing and aggregating blog content. It uses TypeScript, the Drizzle ORM, and PostgreSQL for efficient and scalable data management.

## Prerequisites

Before running this CLI, ensure you have the following installed:

1. **Node.js**: Version 18 or later is recommended.
2. **npm** (Node Package Manager): Comes bundled with Node.js.
3. **PostgreSQL**: A running PostgreSQL database instance is required to connect with the CLI.

## Installation

1. Clone the repository to your local machine:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd blog-aggregator-typescript
   ```
3. Install the required dependencies:
   ```bash
   npm install
   ```

## Configuration

Before running the CLI, you'll need to set up a configuration file in your system's home directory. The configuration file should be named `.gatorconfig.json` and must include the following fields:

- `db_url`: The connection string for your PostgreSQL database.
- `current_user_name`: Your name or the username to associate with the current session.

### Example Configuration:

Create a file named `.gatorconfig.json` in your home directory:
