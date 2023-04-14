//@ts-check

/**
 * 
 * @param {number} low 
 * @param {number} high 
 * @returns {number}
 */
export function randomNumber(low, high) {
	const range = high - low + 1;
	return Math.floor(Math.random() * range) + low;
}