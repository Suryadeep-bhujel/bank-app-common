import dayjs from "dayjs";
export enum DateFormatType {
    DD_MM_YYYY = "DD-MM-YYYY",
    DD_MMM_YYYY = "DD-MMM-YYYY"
}
export class DateAndTimeService {
    static convertDate(dateString: string, dateFormat: DateFormatType = DateFormatType.DD_MM_YYYY): string {
        const d = dayjs(dateString);
        if (!d.isValid()) {
            throw new Error(`Invalid date: ${dateString}`);
        }
        return d.format(dateFormat);
    }
    static convertToDate(date: any, format: DateFormatType = DateFormatType.DD_MM_YYYY): Date {
        const datevalue = dayjs(date, format).toDate();
        console.log("datevalue", datevalue);
        return datevalue;
        // const formattedDate: Date = dayjs(date, format).toDate();
        // return formattedDate;
    }

    static getCurrentDate(): string {
        return dayjs().format('YYYY-MM-DD');
    }

    static getCurrentTime(): string {
        return dayjs().format('HH:mm:ss');
    }

    static getCurrentDateTime(): string {
        return dayjs().format('YYYY-MM-DD HH:mm:ss');
    }

    static getCurrentTimestamp(): number {
        return dayjs().unix();
    }
}