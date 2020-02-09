export default class BuilderLogger {
  constructor(funcName, message, entity) {
    this.funcName = funcName;
    this.message = message;
    this.entity = entity;
  }

  static logError(message) {
    console.error(message);
  }

  log(field) {
    console.error(`builder error field: ${field}`);
    if (this.funcName) {
      console.error(`builder error: throw in ${this.funcName}`);
    }
    if (this.entity) {
      console.error(`entity: ${this.entity}`);
    }
    if (this.message) {
      console.error(`error: ${this.message}`);
    }
  }
}
