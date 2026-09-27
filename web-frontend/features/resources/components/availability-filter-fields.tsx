"use client";

import { useState } from "react";
import type { ResourceDiscoveryFilters } from "../types";
import styles from "./resource-directory.module.css";

interface AvailabilityFilterFieldsProps {
  filters: Pick<
    ResourceDiscoveryFilters,
    "date" | "startTime" | "endTime"
  >;
}

const startTimes = Array.from({ length: 23 }, (_, hour) =>
  `${String(hour).padStart(2, "0")}:00`,
);
const endTimes = Array.from({ length: 23 }, (_, index) =>
  `${String(index + 1).padStart(2, "0")}:00`,
);

export function AvailabilityFilterFields({
  filters,
}: AvailabilityFilterFieldsProps) {
  const [date, setDate] = useState(filters.date ?? "");
  const [startTime, setStartTime] = useState(filters.startTime ?? "");
  const [endTime, setEndTime] = useState(filters.endTime ?? "");
  const invalidOrder = Boolean(startTime && endTime && startTime >= endTime);

  return (
    <>
      <label>
        <span>Operational date</span>
        <input
          name="date"
          type="date"
          value={date}
          required={Boolean(startTime || endTime)}
          aria-describedby="availability-filter-hint"
          onChange={(event) => setDate(event.target.value)}
        />
      </label>

      <label>
        <span>From</span>
        <select
          name={startTime ? "startTime" : undefined}
          value={startTime}
          required={Boolean(endTime)}
          aria-describedby="availability-filter-hint"
          onChange={(event) => setStartTime(event.target.value)}
        >
          <option value="">Any start</option>
          {startTimes.map((time) => (
            <option value={time} key={time}>
              {time}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Until</span>
        <select
          name={endTime ? "endTime" : undefined}
          value={endTime}
          required={Boolean(startTime)}
          aria-invalid={invalidOrder || undefined}
          aria-describedby="availability-filter-hint"
          onChange={(event) => setEndTime(event.target.value)}
          ref={(element) => {
            element?.setCustomValidity(
              invalidOrder ? "Until must be after From." : "",
            );
          }}
        >
          <option value="">Any end</option>
          {endTimes.map((time) => (
            <option value={time} key={time}>
              {time}
            </option>
          ))}
        </select>
      </label>

      <p className={styles.availabilityHint} id="availability-filter-hint">
        Choose a date with Any start and Any end to find resources free for
        their entire operating day (only if it has not started). To search a
        specific interval, choose both From and Until; Until must be after
        From. Times use ICT (UTC+7). Results exclude closures and times
        occupied by pending, confirmed, or checked-in bookings.
      </p>
    </>
  );
}
