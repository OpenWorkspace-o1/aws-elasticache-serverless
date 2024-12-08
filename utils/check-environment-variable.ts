/**
 * Check if the environment variables are set
 * @param args - Environment variables to check
 * @throws Error if any of the environment variables is not set
 * @returns void
 */
export function checkEnvVariables(...args: string[]) {
    const missingVariables = args.filter(arg => process.env[arg] === undefined);
    if (missingVariables.length > 0) {
        throw new Error(`The following environment variables are not set yet: ${missingVariables.join(', ')}. Please set them in .env file or pipeline environments.`);
    }
};

/**
 * Parses a string to a boolean value.
 * @param enable - The string to parse.
 * @returns {boolean} - Returns true if the string is "true" or "TRUE", otherwise false.
 */
export function booleanParser(enable: string | undefined): boolean {
    return enable?.toLowerCase() === 'true' || false;
}

/**
 * Checks if the input is an array and not empty.
 * @param inputArray - The array to check.
 * @returns {boolean} - Returns true if the input is an array and not empty, otherwise false.
 */
export function isNotEmptyArray<T>(inputArray: T[] | undefined): boolean {
    return !!inputArray?.length;
}

/**
 * Validates a password to ensure it meets the requirements. Password must be at least 16 characters long and contain a mix of uppercase, lowercase, numbers and special characters.
 * @param password - The password to validate.
 * @returns {boolean} - Returns true if the password is valid, otherwise false.
 */
export function validatePassword(password: string): boolean {
    return password.length >= 16 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{16,}$/.test(password);
}
