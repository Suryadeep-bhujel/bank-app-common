import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
dayjs.extend(customParseFormat);
dayjs.extend(utc);
export enum DateFormatType {
    DD_MM_YYYY = "DD-MM-YYYY",
    DD_MMM_YYYY = "DD-MMM-YYYY",
    DD_MM_YYYY_HH_mm = "DD-MM-YYYY HH:mm",
    YYYY_MM_DD = "YYYY-MM-DD",
    YYYY_MM_DD_HH_mm_ss = "YYYY-MM-DD HH:mm:ss",
    HH_mm_ss = "HH:mm:ss",
    HH_mm = "HH:mm",
    YYYY_MM_DDTHH_mm_ssZ = "YYYY-MM-DDTHH:mm:ssZ",// ISO with timezone
    YYYY_MM_DDTHH_mm_ss_SSSZ = "YYYY-MM-DDTHH:mm:ss.SSSZ"
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
        const datevalue = dayjs(this.prepareADate(date, format), format).toDate();
        return datevalue;
    }
    static convertToDateString(date: any, format: DateFormatType = DateFormatType.DD_MM_YYYY): string {
        if(!date){
            return '';
        }
        // console.log("date value before conversion", date, "date value after first conversion", this.prepareADate(date, format))
        const datevalue = dayjs(this.prepareADate(date, format), format).format(format);
        // console.log("datevalue after final conversion", datevalue);
        if(datevalue){
            return datevalue;
        }
        return '';
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

    private static prepareADate(date: string, format: DateFormatType = DateFormatType.DD_MM_YYYY) {
        const formats = [
            "DD-MM-YYYY",
            "DD/MM/YYYY",
            "DD-MM-YYYY HH:mm",
            "DD/MM/YYYY HH:mm",
            "YYYY-MM-DD",
            "YYYY/MM/DD",
            "YYYY-MM-DDTHH:mm:ssZ", // ISO with timezone
            "YYYY-MM-DDTHH:mm:ss.SSSZ",
            "MM-DD-YYYY"
        ];

        // strict check against known formats (requires customParseFormat plugin to be loaded)
        for (const fmt of formats) {
            if (dayjs(date, fmt, true).isValid()) {
                // console.log("fmtfmtfmt", fmt, format, "date", date)
                if (format?.toString() === fmt) {
                    return date;
                }
                return dayjs(date, fmt).format(String(format));
            }
        }
        return date;
    }
}