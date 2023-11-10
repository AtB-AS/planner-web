import { NoticeFragment } from '@atb/modules/situations/types';
import { onlyUniquesBasedOnField } from '@atb/utils/only-uniques';
import { Leg } from '../../../server/journey-planner/validators';

/**
 * Filter notices by removing duplicates (by id), removing those without text,
 * and also sorting them since the order from Entur may change on each request.
 */
export const filterNotices = (
  notices: NoticeFragment[],
): Required<NoticeFragment>[] =>
  notices
    .filter((n): n is Required<NoticeFragment> => !!n.text)
    .filter(onlyUniquesBasedOnField('id'))
    .sort((s1, s2) => s1.id.localeCompare(s2.id));

export const getNoticesForLeg = (leg: Leg) =>
  filterNotices([
    ...(leg.line?.notices || []),
    ...(leg.serviceJourney?.notices || []),
    ...(leg.serviceJourney?.journeyPattern?.notices || []),
    ...(leg.fromEstimatedCall?.notices || []),
  ]);
