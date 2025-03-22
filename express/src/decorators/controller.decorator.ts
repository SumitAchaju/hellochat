import metaDataKeys from "./metadata.enum.js";

export interface IController {
  basePath: string;
  middleware?: any[];
}

const Controller = (basePath: string, middleware?: any[]) => {
  return (target: any) => {
    Reflect.defineMetadata(
      metaDataKeys.controller,
      {
        basePath,
        middleware,
      },
      target
    );
  };
};

export default Controller;
