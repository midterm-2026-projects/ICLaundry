import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

try {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
} catch (error) {
  console.error(error);
}
