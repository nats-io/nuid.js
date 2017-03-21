
declare class Nuid {

    /**
     * Resets the prefix of the global nuid, as well as the
     * pseudo random sequence number and increment amounts.
     */
	next():string;

    /**
     * Resets the prefix of the global nuid from random bytes, as
     * well as the pseudo random sequence number and increment amounts.
     */
    reset():void;
}