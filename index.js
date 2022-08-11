const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
var bodyParser = require("body-parser");
const {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} = require("unique-names-generator");
const path = require("path");
const PublicPath = path.join(__dirname, "public");

const app = express();
const PORT = 5000;

// MiddleWares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// EJS
app.set("view engine", "ejs");

// Random Name Generator
const randomName = uniqueNamesGenerator({
  dictionaries: [adjectives, colors, animals],
});

// FileName
const filename = randomName;

// Code

var CodeError = null || "No Error";
var CodeOutput = null || "No Output";

async function Execeute(filename, code) {
  await fs.writeFile(filename + ".cpp", code, (err) => {
    console.log("File Created");
  });
  let codeRun = await exec(
    `g++ ${filename}.cpp -o ${filename} &&  .\\${filename}`,
    async (err, stdout, stderr) => {
      if (err) {
        await console.error(stderr);
        CodeError = await stderr;
      }
      console.log(stdout);
      CodeOutput = await stdout;
    }
  );
}

// Delete File
const DeleteCodeFiles = async (filename) => {
  fs.unlink(filename + ".cpp", (err) => {
    console.log("File Deleted SuccessFully");
  });
  fs.unlink(filename + ".exe", (err) => {
    console.log("File Deleted SuccessFully");
  });
};

// Routings
app.get("/", (req, res) => {
  res.sendFile(`${PublicPath}/index.html`);
});

app.get("/compiler", (req, res) => {
  res.render("compiler", { CodeOutput, CodeError });
});

app.post("/compile", (req, res) => {
  let { code } = req.body;
  Execeute(filename, code);
  setTimeout(() => {
    res.redirect("/compiler");
    DeleteCodeFiles(filename);
  }, 1000);
});

app.listen(PORT, () => {
  console.log(`Server is Running on ${PORT}`);
});
