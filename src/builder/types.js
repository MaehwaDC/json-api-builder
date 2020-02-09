
/**
 * @typedef {object} IEntity
 * @property {string} id - id сущьности
 * @property {string} type - тип сущьности
 * @property {IEntitiesEntry} [relationships] - связи сущьности
 */

/**
 * @typedef {object} IEntitiesEntry
 * @property {Array<IEntity> | IEntity} [data]
 * @property {Object} [meta]
 */

/**
 * @typedef {object} IReturnedEntitiesEntry
 * @property {Array<Object> | Object} [data]
 * @property {Object} [meta]
 */
