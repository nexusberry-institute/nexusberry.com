// utils/dateUtils.ts
import { format, parseISO } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

const PAKISTAN_TZ = 'Asia/Karachi';

// Types
export type DateInput = string | Date | null | undefined;
export type DateFormatString =
    | 'h:mm a'                 // 7:30 PM
    | 'HH:mm'                  // 19:30
    | 'do MMM yyyy'            // 27th Mar 2024
    | 'dd MMM yyyy'            // 27 Mar 2024  
    | 'dd/MM/yyyy'             // 15/03/2024
    | 'yyyy-MM-dd'             // 2024-03-15
    | 'do MMM yyyy, h:mm a'    // 27th Mar 2024, 7:30 PM
    | 'dd MMM yyyy, h:mm a'    // 27 Mar 2024, 7:30 PM
    | 'EEEE, do MMMM yyyy'     // Friday, 27th March 2024
    | 'EEEE, dd MMMM yyyy'     // Friday, 27 March 2024
    | 'do MMM, eee'            // 27th Sep, Sat
    | 'do MMM, EEEE'           // 27th Sep, Saturday
    | 'h:mm a - h:mm a'        // 07:30 PM - 09:00 PM
    | string;

// Helper function to safely parse date
const safeParseDate = (date: DateInput): Date | null => {
    if (!date) return null;
    try {
        return typeof date === 'string' ? parseISO(date) : date;
    } catch {
        return null;
    }
};

// Convert UTC date from DB to Pakistan time for display
export const formatPakistanTime = (
    utcDate: DateInput,
    formatString: DateFormatString = 'h:mm a'
): string => {
    const date = safeParseDate(utcDate);
    if (!date) return '';

    try {
        const pakistanTime = toZonedTime(date, PAKISTAN_TZ);
        return format(pakistanTime, formatString);
    } catch (error) {
        console.error('Error formatting Pakistan time:', error);
        return '';
    }
};

// Convert Pakistan time input to UTC for saving
export const convertToUTC = (pakistanTimeInput: DateInput): Date | null => {
    const date = safeParseDate(pakistanTimeInput);
    if (!date) return null;

    try {
        return fromZonedTime(date, PAKISTAN_TZ);
    } catch (error) {
        console.error('Error converting to UTC:', error);
        return null;
    }
};

// Pre-defined format functions
export const formatPakistanTimeOnly = (utcDate: DateInput): string =>
    formatPakistanTime(utcDate, 'h:mm a');

export const formatPakistanDate = (utcDate: DateInput): string =>
    formatPakistanTime(utcDate, 'do MMM yyyy');

export const formatPakistanDateTime = (utcDate: DateInput): string =>
    formatPakistanTime(utcDate, 'do MMM yyyy, h:mm a');

export const formatPakistanDateShort = (utcDate: DateInput): string =>
    formatPakistanTime(utcDate, 'dd/MM/yyyy');

export const formatPakistanDateLong = (utcDate: DateInput): string =>
    formatPakistanTime(utcDate, 'EEEE, do MMMM yyyy');

// Utility functions
export const isPakistanToday = (utcDate: DateInput): boolean => {
    const date = safeParseDate(utcDate);
    if (!date) return false;

    try {
        const pakistanTime = toZonedTime(date, PAKISTAN_TZ);
        const today = toZonedTime(new Date(), PAKISTAN_TZ);
        return format(pakistanTime, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
    } catch {
        return false;
    }
};

export const getCurrentPakistanTime = (): Date => {
    return toZonedTime(new Date(), PAKISTAN_TZ);
};

// Additional format variations
export const formatPakistanDateWithOrdinal = (utcDate: DateInput): string =>
    formatPakistanTime(utcDate, 'do MMM yyyy');

export const formatPakistanDatePlain = (utcDate: DateInput): string =>
    formatPakistanTime(utcDate, 'dd MMM yyyy');

export const formatPakistanDateTimeWithOrdinal = (utcDate: DateInput): string =>
    formatPakistanTime(utcDate, 'do MMM yyyy, h:mm a');

// Event-style formats - Your requested structures
export const formatEventDate = (utcDate: DateInput): string =>
    formatPakistanTime(utcDate, 'do MMM, EEEE'); // "27th Sep, Saturday"

export const formatEventDateShort = (utcDate: DateInput): string =>
    formatPakistanTime(utcDate, 'do MMM, eee'); // "27th Sep, Sat"

export const formatEventTime = (utcDate: DateInput): string =>
    formatPakistanTime(utcDate, 'hh:mm a'); // "07:30 PM"

// Format time range for events
export const formatEventTimeRange = (startDate: DateInput, endDate: DateInput): string => {
    const startTime = formatPakistanTime(startDate, 'hh:mm a');
    const endTime = formatPakistanTime(endDate, 'hh:mm a');
    return `${startTime} - ${endTime}`; // "07:30 PM - 09:00 PM"
};


export const getPakistanDateOnly = (utcDate: DateInput): Date | null => {
    const date = safeParseDate(utcDate);
    if (!date) return null;

    try {
        return toZonedTime(date, PAKISTAN_TZ);
    } catch {
        return null;
    }
};

export const isValidDate = (date: DateInput): boolean => {
    return safeParseDate(date) !== null;
};

// Comparison functions
export const isPakistanDateBefore = (date1: DateInput, date2: DateInput): boolean => {
    const d1 = safeParseDate(date1);
    const d2 = safeParseDate(date2);
    if (!d1 || !d2) return false;

    try {
        const pk1 = toZonedTime(d1, PAKISTAN_TZ);
        const pk2 = toZonedTime(d2, PAKISTAN_TZ);
        return pk1 < pk2;
    } catch {
        return false;
    }
};

export const isPakistanDateAfter = (date1: DateInput, date2: DateInput): boolean => {
    const d1 = safeParseDate(date1);
    const d2 = safeParseDate(date2);
    if (!d1 || !d2) return false;

    try {
        const pk1 = toZonedTime(d1, PAKISTAN_TZ);
        const pk2 = toZonedTime(d2, PAKISTAN_TZ);
        return pk1 > pk2;
    } catch {
        return false;
    }
};