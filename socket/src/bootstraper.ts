import express from "express";
import type { Application, ErrorRequestHandler } from "express";
import { Server } from "http";
import { Server as IoServer, ServerOptions } from "socket.io";
import metaDataKeys from "./decorators/metadata.enum.js";
import { IRouter } from "./decorators/routes.decorator.js";
import { IController } from "./decorators/controller.decorator.js";
import NotFoundError from "./errors/notfound.error.js";
import ioMetaDataKeys from "./socket/decorators/metaDataKeys.js";
import { IEvent } from "./socket/decorators/event.js";
import { CustomSocket } from "./socket/types.js";
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
export interface ISocketIoApplication {
  server: Server;
  middlewares: any[];
  events: any[];
  options?: Partial<ServerOptions>;
}

class SocketIoApplication {
  private io: IoServer;

  constructor(private config: ISocketIoApplication) {
    this.io = new IoServer(config.server, config.options);

    this.setupMiddlewares();
    this.setupEvents();
  }

  public close() {
    return this.io.close();
  }

  public getIo() {
    return this.io;
  }

  private setupMiddlewares() {
    this.config.middlewares.forEach((middleware) => {
      this.io.use(middleware);
    });
  }

  private setupEvents() {
    this.io.on("connection", (socket: CustomSocket) => {
      this.config.events.forEach((Event) => {
        const instance = new Event(this.io, socket);
        const events: IEvent[] = Reflect.getMetadata(
          ioMetaDataKeys.events,
          Event
        );

        const eventInfo: Array<{ event: string; handler: string }> = [];

        events.forEach(({ name, handlerName }) => {
          socket.on(name, instance[String(handlerName)].bind(instance));
          eventInfo.push({
            event: name,
            handler: handlerName.toString(),
          });
        });

        // console.table(eventInfo);
      });
    });
  }
}

export { ExpressApplication, SocketIoApplication };
