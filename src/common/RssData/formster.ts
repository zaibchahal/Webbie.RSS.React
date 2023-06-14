import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

export const convertLocal = (date: Date) => {
    dayjs.extend(utc);
    var d = dayjs.utc(date).local().toDate();
    return d;
}

export const getLocal = (date: Date) => {
    dayjs.extend(utc);
    return dayjs.utc(date).local();
}
const NumberFormatter = (value: number, minimumFractionDigits?: number, maximumFractionDigits?: number) => {
    const formattedValue = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: minimumFractionDigits ?? 0,
        maximumFractionDigits: maximumFractionDigits ?? 0,
    }).format(value);

    return formattedValue;
};

export default NumberFormatter;