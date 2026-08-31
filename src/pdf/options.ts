//#region public methods

/**
 * Returns PDF generation options (A4, no margins, print background)
 * @returns PDF options object
 */
export function getPdfOptions(): PdfOptions {
  return {
    format: 'A4',
    printBackground: true,
    margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
  };
}

//#endregion

//#region public types

/**
 * PDF generation options
 */
export interface PdfOptions {
  format: 'A4';
  printBackground: boolean;
  margin: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
}

//#endregion
