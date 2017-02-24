
export const VERSION: string;

/** Returns the next nuid from the global generator.
 *  
 * @export
 * @returns {string}
 */
export declare function next(): string;

/**
 * Resets the prefix of the global nuid from random bytes, as
 * well as the pseudo random sequence number and increment amounts.
 * @export
 */
export declare function reset(): void