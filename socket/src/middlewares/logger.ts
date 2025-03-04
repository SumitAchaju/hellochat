import morgan from "morgan";
import logger from "../utils/logger.js";

const morganFormat = ":method :url :status :response-time ms";
const httpLogger = morgan(morganFormat, {
  stream: {
    write: (message) => {
      const logObject = {
        method: message.split(" ")[0],
        url: message.split(" ")[1],
        status: message.split(" ")[2],
        responseTime: message.split(" ")[3],
      };
      if (Number(logObject.status) >= 400) {
        logger.error(JSON.stringify(logObject));
      } else {
        logger.info(JSON.stringify(logObject));
      }
    },
  },
});

export default httpLogger;
