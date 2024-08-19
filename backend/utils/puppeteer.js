export async function waitAndType(page, selector, text) {
    await page.waitForSelector(selector);
    await page.type(selector, text);
    return
}