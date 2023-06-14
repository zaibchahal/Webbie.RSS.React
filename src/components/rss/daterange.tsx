import React, { useEffect, useState } from 'react';
import { format, addDays, differenceInDays } from 'date-fns';
import Input from '../bootstrap/forms/Input';
import dayjs from 'dayjs';
import { AppConst } from '../../common/RssData/constants';

type DatesSelectedCallback = (startDate: Date, endDate: Date) => void;

interface IProps {
    onDatesSelected?: DatesSelectedCallback | undefined
}

export const GetStartOfDay = (d: Date) => {
    return new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate()
    );
}
export const GetEndOfDay = (d: Date) => {
    return new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        23, // hours
        59, // minutes
        59  // seconds
    );
}

export const DateRangePicker = (d: IProps) => {
    const [startDate, setStartDate] = useState(GetStartOfDay(new Date()));
    const [endDate, setEndDate] = useState(GetEndOfDay(new Date()));


    useEffect(() => {
        if (d.onDatesSelected) d.onDatesSelected(startDate, endDate);
        console.log(startDate, endDate);
    }, [startDate, endDate, d]);

    const handleCalculateDays = () => {
        const days = differenceInDays(endDate, startDate);
        console.log(`Number of days: ${days}`);
    };

    const handleStartDateChange = (e: any) => {
        const selectedStartDate = GetStartOfDay(new Date(e.target.value));
        setStartDate(selectedStartDate);
    };

    const handleEndDateChange = (e: any) => {
        const selectedEndDate = GetEndOfDay(new Date(e.target.value));
        setEndDate(selectedEndDate);
    };

    return (
        <div className="row">
            <div className="col">
                <label className="form-label">Date From</label>
                <Input
                    className="form-control form-control-solid"
                    type="date"
                    value={dayjs(startDate).format(AppConst.Formats.dateForm)}
                    onChange={handleStartDateChange}
                />
            </div>
            <div className="col">
                <label className="form-label">Date To</label>
                <Input
                    className="form-control form-control-solid"
                    type="date"
                    value={dayjs(endDate).format(AppConst.Formats.dateForm)}
                    onChange={handleEndDateChange}
                />
            </div>
        </div>
    );
};
