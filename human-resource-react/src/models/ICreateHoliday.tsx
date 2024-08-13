import {Dayjs} from "dayjs";

export interface ICreateHoliday {
    holidayName: string;
    holidayType: string;
    startDate: Date;
    endDate: Date;
    token: string;
}