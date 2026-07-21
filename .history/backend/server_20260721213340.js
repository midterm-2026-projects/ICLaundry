import dotenv from "dotenv";

dotenv.config();

const startServer = async () => {
  try {
    const { default: app } = await import("./app.js");

    const PORT = Number(process.env.PORT) || 3000;

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`Backend listening on port ${PORT}`);

      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });

    server.on("error", (error) => {
      console.error("Failed to start backend server:", error);

      process.exit(1);
    });

    const shutdown = (signal) => {
      console.log(`${signal} received. Closing backend server.`);

      server.close((error) => {
        if (error) {
          console.error("Error while closing backend server:", error);

          process.exit(1);
        }

        console.log("Backend server closed.");

        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));

    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    console.error("Unable to initialize backend:", error);

    process.exit(1);
  }
};

startServer();
