import React, { useEffect, useState } from 'react';
import { format, addDays, differenceInDays } from 'date-fns';
import Input from '../bootstrap/forms/Input';
import './style.css';
import dayjs from 'dayjs';
import { AppConst } from '../../common/RssData/constants';
import { DateRange, DateRangePicker, Range } from 'react-date-range';
import startOfDay from 'date-fns/esm/fp/startOfDay/index';
import Icon from '../icon/Icon';
import InputGroup, { InputGroupText } from '../bootstrap/forms/InputGroup';
import Button from '../bootstrap/Button';
type DatesSelectedCallback = (startDate: Date, endDate: Date) => void;

interface IProps {
    onDatesSelected?: DatesSelectedCallback | undefined
}

export const GetStartOfDay = (d?: Date) => {
    if (!d) d = new Date();
    return new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate()
    );
}
export const GetEndOfDay = (d?: Date) => {
    if (!d) d = new Date();
    return new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        23, // hours
        59, // minutes
        59  // seconds
    );
}

export const DateRangePicker2 = (d: IProps) => {

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedRange, setSelectedRange] = useState<Range[]>([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);




    useEffect(() => {
        var r = selectedRange[0];
        if (d.onDatesSelected) d.onDatesSelected(GetStartOfDay(r.startDate), GetEndOfDay(r.endDate));
        setShowDatePicker(false);
    }, [selectedRange, d]);

    return (
        <div>
            <div className='date-range-container'>

                <InputGroup
                    id={''}
                    className={''}
                    isWrap={true}
                    size={'sm'} // null || 'sm' || 'lg'
                >
                    <button className="btn btn-primary" onClick={() => setShowDatePicker(!showDatePicker)}>
                        <Icon icon="CalendarToday" />
                    </button>
                    <Input value={dayjs(selectedRange[0].startDate).format(AppConst.Formats.date) + " --- " + dayjs(selectedRange[0].endDate).format(AppConst.Formats.date)} />
                </InputGroup>
                {showDatePicker && (
                    <div className="date-range">
                        <DateRangePicker
                            ranges={selectedRange}
                            onChange={item => setSelectedRange([item.selection])}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
