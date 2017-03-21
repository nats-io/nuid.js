export const version: string;

/**
 * Resets the prefix of the global nuid, as well as the
 * pseudo random sequence number and increment amounts.
 *
 * @returns {string}
 */
export function next(): string;

/**
 * Resets the prefix of the global nuid from random bytes, as
 * well as the pseudo random sequence number and increment amounts.
 */
export function reset(): void;