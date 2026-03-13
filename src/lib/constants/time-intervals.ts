interface TimeIntervals {
	WEEK: number;
	DAY: number;
	FIVE_MINUTES: number;
}
export const TIME_INTERVALS: TimeIntervals = {
	WEEK: 7 * 24 * 60 * 60 * 1000,
	DAY: 1000 * 60 * 60 * 24,
	FIVE_MINUTES: 1000 * 60 * 5,
};
