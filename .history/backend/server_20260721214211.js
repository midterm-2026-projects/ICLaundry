import dotenv from "dotenv";

dotenv.config();

const startServer = async () => {
  try {
    const { default: app } = await import("./app.js");

    const PORT = Number(process.env.PORT) || 3000;

    const server = app.listen(PORT, "127.0.0.1", () => {
      console.log(`Backend listening at http://127.0.0.1:${PORT}`);

      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });

    server.on("error", (error) => {
      console.error("Backend server error:", error);

      process.exitCode = 1;
    });

    const shutdown = (signal) => {
      console.log(`${signal} received. Closing backend server.`);

      server.close((error) => {
        if (error) {
          console.error("Failed to close backend server:", error);

          process.exit(1);
        }

        console.log("Backend server closed.");

        process.exit(0);
      });
    };

    process.once("SIGTERM", () => {
      shutdown("SIGTERM");
    });

    process.once("SIGINT", () => {
      shutdown("SIGINT");
    });
  } catch (error) {
    console.error("Unable to initialize backend:", error);

    process.exit(1);
  }
};

await startServer();
