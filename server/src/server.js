import app from "./app.js";

let server;

function run() {
  server = app.listen(process.env.PORT, () => {
    console.log(`Server listening at http://localhost:${process.env.PORT}`);
  });
}

run();
