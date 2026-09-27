/** Staff can manually confirm check-in this long before the booking starts. */
export const CHECK_IN_OPENS_MINUTES_BEFORE_START = 15;

/**
 * A confirmed booking not checked in by staff this long after its start is
 * released as a no-show, so the rest of the slot becomes bookable again.
 */
export const CHECK_IN_GRACE_MINUTES = 15;
