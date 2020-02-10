import memoize from 'lodash.memoize';
import unset from 'lodash.unset';
import {
  isArray,
  keys,
  merge,
  isNil,
} from '../utils/helpers';
import './types';

/**
 * @type {Object} builder
 * @param {IBuild} build
 * @param {IFormatEntity} formatEntity
 * @param {IBuildElements} buildElements
 * @param {IGetFormatter} getFormatter
 * */
const builder = {
  /** входная точка(функция) для ветви рекрсии билдера
   * работает с объектами типа { data, meta }
   * @name IBuild
   * @param {IEntitiesEntry} entitiesEntry
   * @return {IReturnedEntitiesEntry} */
  build: function build(entitiesEntry) {
    const { data, meta } = entitiesEntry;
    const builtData = {};

    try {
      if (data) {
        try {
          builtData.data = this.buildElements(data);
        } catch (e) {
          throw { error: e, field: 'data' };
        }
      }

      if (meta) {
        try {
          const metaKeys = keys(meta);
          builtData.meta = metaKeys.reduce((accum, key) => ({
            ...accum,
            [key]: this.buildElements(meta[key]),
          }), {});
        } catch (e) {
          throw { error: e, field: 'meta' };
        }
      }
    } catch (e) {
      if (Object.is(e, this.Logger)) {
        e.error.log(e.field);
        throw e.error.message;
      }

      throw e.error;
    }

    return builtData;
  },

  /** Функция отвечает за форматирование сущьности, и рекурсивое ветвление,
   * связана ли сущность с другими сущностами
   * @name IFormatEntity
   * @param {IEntity} entity
   * @return {Object} */
  formatEntity: function buildEntity(entity) {
    if (isNil(entity)) {
      return null;
    }

    const { type, id } = entity;

    // возвращаем саму сущность, если у нее нет типа или id
    if (!type || !id) {
      return entity;
    }

    const builtEntity = entity;
    // если сущьность не нашлась в объекте entities берем объект entity
    // в рамках апи, такое может быть в поле meta
    if (this.entities[type] && this.entities[type][id]) {
      buildEntity = this.entities[type][id];
    }

    const { relationships } = builtEntity;

    // выход с рекурсии если утыкаемся в объект без поля relationships
    if (!relationships) {
      return this.applyMiddlewares(builtEntity);
    }

    const relationshipsKeys = keys(relationships);

    // пробегаемся по ключам relationships и уходим глубже в рекурсию
    const builtRelationships = relationshipsKeys.reduce((accum, relKey) => {
      if (!relationships[relKey]) {
        return { ...accum };
      }

      // создаем еще одну ветку рекурсии для внутрененго пля relationships
      const builtRel = this.build(relationships[relKey]);

      const relKeys = keys(builtRel);

      return {
        ...accum,
        [relKey]: relKeys.length > 1 ? builtRel : builtRel[relKeys[0]],
      };
    }, {});

    // мерджим не теря ссылки на объекет, что бы сработала мемоизация
    // и удаляем поле relationships
    unset(merge(builtEntity, builtRelationships), ['relationships']);

    return this.applyMiddlewares(builtEntity);
  },

  /** Всопмогательная функция, которая вызывает сама себя для каждого элемента,
   * в случаи если входные данные являются масивом,
   * в ином случаи вызывает formatEntity для сущьности
   * @name IBuildElements
   * @param {(Array<IEntity> | IEntity)} data
   * @return {(Array<Object> | Object)}
   * */
  buildElements: function buildElement(data) {
    if (isArray(data)) {
      return data.map((el) => this.buildElements(el));
    }

    return this.formatEntity(data);
  },

  /**
   * функция применяет все middleware для одной сущьности
   * мемоизируется для сущности которая уже вычислялась, вернутся старые значения
   * @param {object} entity - тякущая сущность, для которой буду применяться middleware
   */
  applyMiddlewares: memoize(
    function applyMiddlewares(entity) {
      let newEntity = entity;

      this.middlewares.forEach((middleware) => {
        try {
          newEntity = middleware(newEntity);
        } catch (e) {
          throw new this.Logger(`middleware ${middleware.name}`, e, entity.type);
        }
      });

      return newEntity;
    },
  ),
};

export default builder;
