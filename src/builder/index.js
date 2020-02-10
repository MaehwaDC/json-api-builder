import { isFunction } from '../utils/helpers';
import builder from './builder';
import { BuildLogger } from '../middlewares';

function normalizeMiddlewarer(middlewares) {
  return middlewares.filter(isFunction);
}

export default function createBuilder(opt) {
  const {
    extractor,
    middlewares = [],
    logger: currentLogget = BuildLogger,
  } = opt;

  return function initBuild(json) {
    const newBuilder = Object.create(builder, {
      middlewares: { value: normalizeMiddlewarer(middlewares) },
      entities: { value: extractor ? extractor(json) : json, writable: false },
      Logger: { value: currentLogget },
    });

    return {
      ...newBuilder.build(json),
      entities: newBuilder.entities,
    };
  };
}
