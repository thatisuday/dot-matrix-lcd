// pad left zeros to a binary number to achieve certain length
export const padLeftZeros = (binaryString, desiredLength) => {
    const zerosString = Array(desiredLength).fill("0").join(0);
    const finalString = zerosString + binaryString;

    return finalString.slice(-desiredLength);
};