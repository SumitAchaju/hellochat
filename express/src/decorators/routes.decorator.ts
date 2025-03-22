import metaDataKeys from "./metadata.enum.js";

export enum Methods {
  GET = "get",
  PUT = "put",
  PATCH = "patch",
  POST = "post",
  DELETE = "delete",
}

export interface IRouter {
  method: Methods;
  middlewares?: any[];
  handlerPath: string;
  handlerName: string | symbol;
}

const routeFactory =
  (method: Methods) =>
  (path: string, middlewares?: any[]): MethodDecorator =>
  (target, propertyKey) => {
    const routes: IRouter[] =
      Reflect.getMetadata("routes", target.constructor) || [];
    routes.push({
      method,
      middlewares,
      handlerPath: path,
      handlerName: propertyKey,
    });
    Reflect.defineMetadata(metaDataKeys.routes, routes, target.constructor);
  };

const Get = routeFactory(Methods.GET);
const Post = routeFactory(Methods.POST);
const Put = routeFactory(Methods.PUT);
const Delete = routeFactory(Methods.DELETE);
const Patch = routeFactory(Methods.PATCH);

export { Get, Post, Patch, Put, Delete };
