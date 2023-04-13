export const Percentage = {
    pattern: `(^100(\\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\\.[0-9]{1,2})?$)`,
    patternMsg: `Number between 0-100 with optional decimal`
};

export const AmountWithDecimal = {
    pattern: `^([-])?[1-9]([0-9]{1,13})?(\\.[0-9]{2})?$`,
    patternMsg: `Max-length 14 digits allow with optional decimal`
};

export const AmountWithoutDecimal = {
    pattern: `^([-])?[1-9]([0-9]{1,13})?$`,
    patternMsg: `Max-lengt 14 digits allow `
};

export const AmountWithDecimalNoNegative = {
    pattern: `^[1-9]([0-9]{1,13})?(\\.[0-9]{2})?$`,
    patternMsg: `Max-lengt 14 digits allow with optional decimal without negative value`
};

export const AmountWithoutDecimalNoNegative = {
    pattern: `^[1-9]([0-9]{1,13})?$`,
    patternMsg: `Max-lengt 14 digits allow without negative value`
};

export const PinCodeIndia = {
    pattern: `^[0-9]{6}$`,
    patternMsg: `Exact 6 digits required`
};

export const PinCodeOutside = {
    pattern: `^[0-9]{8,}$`,
    patternMsg: `Exact upto 8 digits required`
};

export const IFSCCode = {
    pattern: `^[A-Z]{4}[0][A-Z0-9]{6}$`,
    patternMsg: `4 Character, followed by 0, followed by 6 number. `
};

export const GSTIN = {
    pattern: `^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]{3}$`,
    patternMsg: `First 2 digits, next 5 are character, next 4 are digits, and 1 character, and last 3 is character or digits`
};

export const TAN = {
    pattern: `^[A-Z]{4}[0-9]{5}[A-Z]$`,
    patternMsg: `First 4 are character, next 5 are digits and last one is character`
};

export const PAN = {
    pattern: `^[A-Z]{3}[P|H|C|J|F|A|T|B|L|G][A-Z]{1}[0-9]{4}[A-Z]{1}$`,
    patternMsg: `First 5 are character, next 4 are digits and last one is character`
};
export const PF = {
    pattern: `^[a-zA-Z0-9]{22}$`,
    patternMsg: `Exact 22 digits we need`
};

export const UAN = {
    pattern: `^[0-9]{12}$`,
    patternMsg: `Exact 12 digits we need`
};

export const ESI = {
    pattern: `^[0-9]{17}$`,
    patternMsg: `Exact 17 digits we need`
};

export const BankAccount = {
    pattern: `^[0-9]{6,16}$`,
    patternMsg: 'Invalid A/C'
};

export const LLP = {
    pattern: `^[A-Z0-9-]{8}$`,
    patternMsg: '^[A-Z0-9-]{8}$'
};
export const Aadhar = {
    pattern: `^[0-9]{12}$`,
    patternMsg: 'Exact 12 digits we need'
};

export const CIN = {
    pattern: `^[A-Z0-9]{21}$`,
    patternMsg: '^[A-Z0-9]{21}$'
};

export const Email = {
    pattern: `^([\\w\\.\\-_]+)?\\w+@[\\w-_]+(\\.\\w+){1,}`,
    patternMsg: `Invalid email`
};
export const Mobile = {
    pattern: `^[0-9]{10}$`,
    patternMsg: `Invalid Mobile Number`
};
export const Password = {
    pattern: `^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=(?:.*[!@#$%^&*-]){1})(?!.*[\\s]).{8,}$`,
    patternMsg: `Password must contain numbers, upper case letter, lower case letter, special character and minimum length should be 8`
};
