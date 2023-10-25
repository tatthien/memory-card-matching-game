import fs from "fs";
import path from "path";

const data = fs.readdirSync("public/assets");

data.forEach((item) => {
  const content = fs.readFileSync(`public/assets/${item}`);
  fs.writeFileSync(
    `public/assets/${item}`,
    content.toString().replace(/width="\d+"\sheight="\d+"/, ""),
  );
});
