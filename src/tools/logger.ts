import { log } from "console";
import customError from "./error";

const logger = (error: customError) => {
  let info = JSON.stringify(error.info).split("");
  info.shift();
  info.pop();
  let infostring = info.join("").split(",").join("\n");

  log(
    `----------------------------------------------------------\n\n${error.name}[${error.code}](${error.status}):${error.message}\n\n${infostring}\n\n----------------------------------------------------------`
  );
};
export default logger
