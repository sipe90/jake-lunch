import * as dateFns from 'date-fns'
import { fi } from "date-fns/locale"
import { Weekday } from '../menu-service.js'

export const getYearAndWeek = (date: Date = new Date()): [number, number] => {
    return [
        getYear(date),
        getWeek(date)
    ]
}

export const getISODateStr = (date: Date = new Date()): string => {
    return dateFns.formatISO(date)
}

export const getYear = (date: Date = new Date()): number =>
    dateFns.getISOWeekYear(date)

export const getWeek = (date: Date = new Date()): number =>
    dateFns.getISOWeek(date)

export const getDayOfWeek = (date: Date = new Date()): Weekday => {
    return dateFns.getISODay(date) - 1 as Weekday
}

export const getWeekdayDate = (year: number, week: number, weekday: Weekday): Date => {
    const weekDate = dateFns.parse(`${year.toString(10)} ${week.toString(10)}`, 'R I', new Date(), { weekStartsOn: 1, locale: fi })
    const weekDayDate = dateFns.setISODay(weekDate, weekday + 1)

    return weekDayDate
}

export const getWeekdayDateString = (year: number, week: number, weekday: Weekday): string => {
    const weekDayDate = getWeekdayDate(year, week, weekday)
    const dateStr = dateFns.format(weekDayDate, 'cccc d.M', { weekStartsOn: 1, locale: fi })

    return dateStr.charAt(0).toLocaleUpperCase() + dateStr.slice(1)
}
