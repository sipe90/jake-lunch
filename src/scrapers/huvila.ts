import { HtmlScrape } from '../scrape-service.js'
import logger from '../logger.js'
import { MenuItem } from '../menu-service.js'
import { clampWeekMenu, openPage, sanitizeString } from '../util/scrape-util.js'

const log = logger('scraper:huvila')

const scrape: HtmlScrape = async (context, url) => {
    log.info('Opening a new page and navigating to %s', url)
    const page = await openPage(context, url)

    const menuSectionLocators = await page.locator('.menu-items').all()
    const weekMenu: MenuItem[][] = await Promise.all(menuSectionLocators.map(async (menuSection) => {

        const menuItemLocator = await menuSection.locator('.menu-item').all()
        return Promise.all(menuItemLocator.slice(0, -1).map(async (menuItem) => {
            const nameLocator = menuItem.locator('.menu-item-title')
            const priceLocator = menuItem.locator('.menu-item-price-bottom')
            const descriptionLocator = menuItem.locator('.menu-item-description')

            const name = sanitizeString(await nameLocator.innerText())
            const price = sanitizeString(await priceLocator.innerText())
            const description = sanitizeString(await descriptionLocator.innerText({ timeout: 100 }).catch(() => ''))

            return { name, price, description }
        }))
    }))

    if (weekMenu.length != 5) {
        log.warn('Found an unexpected number of elements in weekday menu (%d != 5)', weekMenu.length)
    }

    log.info('Scrape complete')

    return {
        buffetPrice: null,
        weekMenu: clampWeekMenu(weekMenu),
        allWeekMenu: null,
    }
}



export default scrape