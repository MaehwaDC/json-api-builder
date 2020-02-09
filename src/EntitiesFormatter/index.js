import moment from 'moment';
import { getArr } from 'utils/helpers';
import {
  publicationBuilder,
} from './formatterHelpers';

export default {
  matchesFormatter: (match) => {
    const { template = [], dateTime: selectedMatchData, popularOdds } = match;
    let dateTime = selectedMatchData;

    if (selectedMatchData) {
      dateTime = moment.utc(`${selectedMatchData}-03:00`).format('YYYY-MM-DD HH:mm:ss');
    }
    return {
      ...match,
      seo: template,
      dateTime,
      popularOdds: getArr(popularOdds),
    };
  },

  newsFormatter: publicationBuilder,
  articlesFormatter: publicationBuilder,

  outcomesFormatter: ({ coefficients, outcomeStatus, ...normalizeData }) => ({
    ...normalizeData,
    coefficients: coefficients.map(el => el.value),
    outcomeStatus,
  }),
};
