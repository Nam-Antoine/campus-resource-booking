export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  /** A request nobody reviewed by its check-in deadline; it holds no slot. */
  EXPIRED = 'expired',
}
