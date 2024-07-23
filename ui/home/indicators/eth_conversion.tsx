// utils/conversion.ts


/**
 * Converts Wei to Ether.
 * @param wei - The amount in Wei.
 * @returns The amount in Ether.
 */

// utils/weiToEth.ts

/**
 * Converts Wei to Ether.
 * 
 * @param wei - The amount in Wei as a string (to support large numbers).
 * @returns The equivalent amount in Ether as a string.
 */
export function weiToEth(wei: any): any {
    // 1 Ether is 10^18 Wei
    const weiToEthFactor = BigInt(1e18);
    const weiBigInt = BigInt(wei);

    const ethBigInt = weiBigInt / weiToEthFactor;
    const remainder = weiBigInt % weiToEthFactor;

    // Convert the integer part and remainder to string
    const ethString = ethBigInt.toString();
    const remainderString = remainder.toString().padStart(18, '0');

    // Combine the integer part and fractional part
    return `${ethString}.${remainderString}`;
}
