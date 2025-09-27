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
        console.log("this.prepareADate(date)", date, this.prepareADate(date, format))
        const datevalue = dayjs(this.prepareADate(date, format), format).toDate();
        console.log("datevalue convertToDate", datevalue);
        return datevalue;
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
            "MM-DD-YYYY"
        ];

        // strict check against known formats (requires customParseFormat plugin to be loaded)
        for (const fmt of formats) {
            console.log("fmtfmtfmt", fmt, format)
            if (dayjs(date, fmt, true).isValid()) {
                if (format === fmt) {
                    return date;
                }
                return dayjs(date).format(format);
            }
        }
        return null;
    }
}