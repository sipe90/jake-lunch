import { getYear, getWeek, getWeekdayDateString } from './util/time-util.js'

export enum Weekday {
    MONDAY = 0,
    TUESDAY = 1,
    WEDNESSDAY = 2,
    THURSDAY = 3,
    FRIDAY = 4,
}

const weekdayValues: Weekday[] = Object.values(Weekday).filter((wd) => typeof wd === 'number') as Weekday[]

export interface Menus {
    year: number
    week: number
    vendorMenus: Menu[]
}

export interface Menu {
    venue: string
    url: string
    weeklyOnly: boolean
    buffet: boolean
    buffetPrice: string | null
    weekMenu: WeekMenuArray | null
    allWeekMenu: MenuItem[] | null
}



export interface WeekMenus {
    week: number
    weekDates: string[]
    menus: WeekMenu[]
}

interface WeekMenu {
    venue: string
    url: string
    weeklyOnly: boolean
    weekMenu: WeekMenuArray | null
    allWeekMenu: MenuItem[] | null
}

export interface DayMenus {
    week: number
    date: string
    menus: DayMenu[]
}

interface DayMenu {
    venue: string
    url: string
    buffet: boolean
    buffetPrice: string | null
    dayMenu: MenuItem[] | null
}

export type WeekMenuArray = [MenuItem[], MenuItem[], MenuItem[], MenuItem[], MenuItem[]]

export interface MenuItem {
    name: string,
    price: string | null,
    description: string | null,
}

let menus: Menus = { year: getYear(), week: getWeek(), vendorMenus: [] }

export const getWeekMenus = (): WeekMenus => {
    const { year, week, vendorMenus } = menus
    return {
        week: week,
        weekDates: weekdayValues.map((wd) => getWeekdayDateString(year, week, wd)),
        menus: vendorMenus.map(({ venue, url, weeklyOnly, weekMenu, allWeekMenu }) => ({
            venue,
            url,
            weekDates: weekdayValues.map((wd) => getWeekdayDateString(year, week, wd)),
            weeklyOnly,
            weekMenu,
            allWeekMenu
        })),
    }
}

export const getDayMenus = (weekday: Weekday): DayMenus => {
    const { year, week, vendorMenus } = menus
    return {
        week: week,
        date: getWeekdayDateString(year, week, weekday),
        menus: vendorMenus.map(({ venue, url, buffet, buffetPrice, weekMenu, allWeekMenu }) => ({
            venue,
            url,
            buffet,
            buffetPrice,
            dayMenu: getDayMenu(weekMenu ? (weekMenu[weekday] || null) : null, allWeekMenu)
        }))
    }
}

const getDayMenu = (weekdayMenu: MenuItem[] | null, allWeekMenu: MenuItem[] | null) => {
    if (weekdayMenu == null && allWeekMenu == null)
        return null
    if (weekdayMenu == null)
        return allWeekMenu
    if (allWeekMenu == null)
        return weekdayMenu
    return weekdayMenu.concat(allWeekMenu)
}

export const saveMenus = (newMenus: Menus): void => { menus = newMenus }