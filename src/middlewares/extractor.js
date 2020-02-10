import {
  values,
  merge,
  toArr,
} from '../utils/helpers';

function extract(data, normalize) {
  const ret = {};

  toArr(data).forEach((elem) => {
    const type = elem.type;
    const id = elem.id;

    ret[type] = ret[type] || {};
    ret[type][id] = elem;

    if (normalize) {
      ret[type][id] = normalize(elem);
    }
  });

  return ret;
}

function extractMeta(meta, normalize) {
  const ret = {};

  values(meta).forEach((elem) => {
    merge(ret, extract(elem, normalize));
  });

  return ret;
}

export default function createExtractor(normalize) {
  return function extractor(json) {
    const res = {};
    if (json.data) {
      merge(res, extract(json.data, normalize));
    }

    if (json.included) {
      merge(res, extract(json.included, normalize));
    }

    if (json.meta) {
      merge(res, extractMeta(json.meta, normalize));
    }

    return res;
  };
}
