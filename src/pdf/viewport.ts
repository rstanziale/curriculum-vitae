interface EvaluateablePage {
  evaluate: (pageFunction: () => number) => Promise<number>;
}

//#region public methods

/**
 * Checks if rendered page exceeds A4 height, logs warning if so
 * @param page - Playwright page object (or any object with evaluate method)
 * @param maxHeight - Maximum allowed height in pixels
 * @throws If page evaluation fails
 */
export async function checkPageHeight(page: EvaluateablePage, maxHeight: number): Promise<void> {
  const actualHeight = await getActualHeight(page);

  if (actualHeight > maxHeight) {
    console.warn(
      `⚠️ WARNING: Content exceeds 1 page! Height: ${actualHeight}px (Max: ${maxHeight}px)`
    );
  } else {
    console.log(`✅ Page size check passed (${actualHeight}px / ${maxHeight}px)`);
  }
}

//#endregion

//#region private methods

/**
 * Gets scrollHeight of .a4-page element
 * @param page - Playwright page object (or any object with evaluate method)
 * @returns Scroll height in pixels
 */
async function getActualHeight(page: EvaluateablePage): Promise<number> {
  return page.evaluate(() => {
    const element = document.querySelector('.cv');
    return element ? element.scrollHeight : 0;
  });
}

//#endregion
