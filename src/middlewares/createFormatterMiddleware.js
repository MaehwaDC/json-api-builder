import {
  get,
  isObject,
} from '../utils/helpers';

function createFieldGetter(pattern) {
  const field = /\[(.*?)\]/.exec(pattern);

  return function getField(object) {
    return pattern.replace(/\[.*?\]/, get(object, field[1]));
  };
}

export default function createFormatterMiddleware(entitiesFormatter, pattern = '[type]Formatter') {
  if (!isObject(entitiesFormatter)) {
    const errorMessage = 'createFormatterMiddleware: parameter must be object with Function fields';
    console.error(errorMessage);

    throw new Error(errorMessage);
  }

  const getField = createFieldGetter(pattern);


  const formatter = function formatterMiddlware(entity) {
    const currentFormatter = entitiesFormatter[getField(entity)];

    if (currentFormatter) {
      return currentFormatter(entity);
    }

    return entity;
  };

  return formatter;
}
