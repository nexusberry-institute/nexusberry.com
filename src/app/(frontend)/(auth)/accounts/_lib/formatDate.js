// const { format } = require('date-fns');
import { format } from 'date-fns';

// https://date-fns.org/v1.29.0/docs/format
export const formatDateString = (dateStr) => {
    const dateObj = new Date(dateStr);
    return format(dateObj, 'EEE, do MMM yyyy, hh:mm a')
}

export const formatToday = () => {
    const dateObj = new Date();
    return format(dateObj, 'EEE, do MMM yyyy, hh:mm a')
}

export const formatDate = (date) => {
    if(!date) return "";
    
    const long = date.split("T")[0]; // 2023-09-14
    const day = long.slice(8);
    const m = long.slice(5, 7);
    let month;
    switch(m){
        case '01':
            month = "Jan";
            break;
        case '02':
            month = "Feb";
            break;
        case '03':
            month = "Mar";
            break;
        case '04':
            month = "Apr";
            break;
        case '05':
            month = "May";
            break;
        case '06':
            month = "Jun";
            break;
        case '07':
            month = "Jul";
            break;
        case '08':
            month = "Aug";
            break;
        case '09':
            month = "Sep";
            break;
        case '10':
            month = "Oct";
            break;
        case '11':
            month = "Nov";
            break;
        case '12':
            month = "Dec";
            break;
    }
    
    return day + "-" + month;;
}