export const PAGE_MARGIN_MM = 20;
export const FOOTER_HEIGHT_MM = 5;

/**
 * PDF generation options filter
 */
export interface PdfFilter {
  withFooter: boolean;
  footerTemplate?: string;
}

/**
 * PDF generation options
 */
export interface PdfOptions {
  format: 'A4';
  printBackground: boolean;
  displayHeaderFooter?: boolean;
  headerTemplate?: string;
  footerTemplate?: string;
  margin: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
}

//#region public methods

/**
 * Returns PDF generation options for an A4 page with an optional external footer
 * @returns PDF options object
 */
export function getPdfOptions(filter?: PdfFilter): PdfOptions {
  const footerTemplate = filter?.withFooter ? filter.footerTemplate : undefined;
  const hasFooter = Boolean(footerTemplate);

  return {
    format: 'A4',
    printBackground: true,
    ...(hasFooter && {
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate,
    }),
    margin: {
      top: `${PAGE_MARGIN_MM}mm`,
      right: `${PAGE_MARGIN_MM}mm`,
      bottom: hasFooter ? `${PAGE_MARGIN_MM + FOOTER_HEIGHT_MM}mm` : `${PAGE_MARGIN_MM}mm`,
      left: `${PAGE_MARGIN_MM}mm`,
    },
  };
}

//#endregion
