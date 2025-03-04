import ioMetaDataKeys from "./metaDataKeys.js";

export interface IEvent {
  name: string;
  handlerName: string | symbol;
}

const Event = (name: string): MethodDecorator => {
  return (target, handlerName) => {
    const events: IEvent[] =
      Reflect.getMetadata(ioMetaDataKeys.events, target.constructor) || [];
    events.push({ name, handlerName });
    Reflect.defineMetadata(ioMetaDataKeys.events, events, target.constructor);
  };
};

export { Event };
