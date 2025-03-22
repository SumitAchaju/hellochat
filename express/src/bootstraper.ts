import express from "express";
import type { Application, ErrorRequestHandler } from "express";
import { Server } from "http";
import { Server as IoServer, ServerOptions } from "socket.io";
import metaDataKeys from "./decorators/metadata.enum.js";
import { IRouter } from "./decorators/routes.decorator.js";
import { IController } from "./decorators/controller.decorator.js";
import NotFoundError from "./errors/notfound.error.js";
import logger from "./utils/logger.js";

interface IExpressApplication {
  port: number | string;
  middlewares: any[];
  controllers: any[];
  errorHandler?: ErrorRequestHandler[];
}

class ExpressApplication {
  private app: Application;

  constructor(private config: IExpressApplication) {
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();

    this.defaultRouteHandler();

    // last error handler
    this.setupErrorHandler();
  }

  public start() {
    return this.app.listen(this.config.port, () => {
      logger.info(`Application is running on port ${this.config.port}`);
    });
  }

  private setupMiddlewares() {
    this.app.use(this.config.middlewares);
  }

  private setupRoutes() {
    this.config.controllers.forEach((Controller) => {
      const instance = new Controller();
      const controller: IController = Reflect.getMetadata(
        metaDataKeys.controller,
        Controller
      );
      const routes: IRouter[] = Reflect.getMetadata(
        metaDataKeys.routes,
        Controller
      );

      const info: Array<{ api: string; handler: string }> = [];

      const expressRouter = express.Router();

      if (controller.middleware) {
        expressRouter.use(controller.middleware);
      }

      routes.forEach(({ method, middlewares, handlerPath, handlerName }) => {
        if (middlewares) {
          expressRouter[method](
            handlerPath,
            ...middlewares,
            instance[String(handlerName)].bind(instance)
          );
        } else {
          expressRouter[method](
            handlerPath,
            instance[String(handlerName)].bind(instance)
          );
        }

        info.push({
          api: controller.basePath + handlerPath,
          handler: handlerName.toString(),
        });
      });
      this.app.use(controller.basePath, expressRouter);
      // console.table(info);
    });
  }

  private setupErrorHandler() {
    if (this.config.errorHandler) {
      this.app.use(this.config.errorHandler);
    }
  }

  private defaultRouteHandler() {
    this.app.use("*", () => {
      throw new NotFoundError("Route", "Route");
    });
  }
}
export { ExpressApplication };