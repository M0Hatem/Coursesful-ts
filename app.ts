import { createServer } from "./src/infrastructure/server";
import { connectDatabase } from "./src/infrastructure/database";
import shutdown from "./src/util/shutdown";
import { Server } from "http";

let server: Server;

const start = async () => {
  try {
    const app = createServer();
    await connectDatabase();
    server = app.listen(process.env.PORT, () => console.log("Server started"));
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
};
start();
process.on("SIGTERM", () => shutdown(server));
process.on("SIGINT", () => shutdown(server));
