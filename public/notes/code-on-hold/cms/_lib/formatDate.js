// const { format } = require('date-fns');
import { format } from 'date-fns';

// https://date-fns.org/v1.29.0/docs/format
export const formatDateString = (dateStr) => {
    const dateObj = new Date(dateStr);
    return format(dateObj, 'EEE, do MMM yyyy, hh:mm a')
}