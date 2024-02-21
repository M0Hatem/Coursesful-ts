import { Server } from "http";

export default function shutdown(server: Server) {
  console.log("Shutting down..");
  server.close(() => console.log("Server shut down"));
}
