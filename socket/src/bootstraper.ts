import express from "express";
import type { Application, ErrorRequestHandler } from "express";
import { Server } from "http";
import { Server as IoServer, ServerOptions } from "socket.io";
import ioMetaDataKeys from "./decorators/metaDataKeys.js";
import { IEvent } from "./decorators/event.js";
import { CustomSocket } from "./types.js";

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

    this.logError();
  }

  public logError() {
    this.io.engine.on("connection_error", (err) => {
      console.log(err.req); // the request object
      console.log(err.code); // the error code, for example 1
      console.log(err.message); // the error message, for example "Session ID unknown"
      console.log(err.context); // some additional error context
    });
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

export { SocketIoApplication };
