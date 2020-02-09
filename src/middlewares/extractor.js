// https://github.com/yury-dymov/json-api-normalizer

import isArray from 'lodash/isArray';
import merge from 'lodash/merge';
import values from 'lodash/values';
import keys from 'lodash/keys';

function wrap(json) {
  if (isArray(json)) {
    return json;
  }

  return [json];
}

function extract(data, normalize) {
  const ret = {};

  wrap(data).forEach((elem) => {
    const {
      type,
      id,
      attributes,
      meta,
      ...otherElementData
    } = elem;

    ret[type] = ret[type] || {};
    ret[type][id] = ret[type][id] || {
      id,
      type,
      ...otherElementData,
      ...meta,
    };

    if (attributes) {
      keys(attributes).forEach((key) => {
        const currentElement = ret[type][id];
        let currentKey = key;

        if (keys(currentElement).includes(key)) {
          currentKey = `attr_${key}`;
        }
        currentElement[currentKey] = attributes[key];
      });
    }

    ret[type][id] = normalize ? normalize(ret[type][id]) : ret[type][id];
  });


  return ret;
}

function extractMeta(meta) {
  const ret = {};

  values(meta).forEach((elem) => {
    merge(ret, extract(elem));
  });

  return ret;
}

export default function createExtractor(normalize) {
  return function extractor(json) {
    const { data, included, meta } = json;

    const res = {};
    if (data) {
      merge(res, extract(data, normalize));
    }

    if (included) {
      merge(res, extract(included, normalize));
    }

    if (meta) {
      merge(res, extractMeta(meta, normalize));
    }

    return res;
  };
}
