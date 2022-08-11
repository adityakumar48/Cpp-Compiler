const express = require("express");
const app = express();
const PORT = 3000;

const { exec } = require("child_process");
const fs = require("fs");
const {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} = require("unique-names-generator");

const randomName = uniqueNamesGenerator({
  dictionaries: [adjectives, colors, animals],
});

const filename = randomName;

const code = `#include <iostream>

using namespace std;

int main()
{
    cout << "Hello world!";

    return 0;
}`;

function Execeute(filename, code) {
  fs.writeFileSync(filename + ".cpp", code);
  exec(
    `g++ ${filename}.cpp -o ${filename} &&  .\\${filename}`,
    (err, stdout, stderr) => {
      if (err) {
        console.log(stderr);
        return;
      }
      console.log(stdout);
    }
  );
}

Execeute(filename, code);

app.listen(PORT, () => {
  console.log(`Server is Running on ${PORT}`);
});
