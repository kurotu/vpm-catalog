/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module "@pagefind/default-ui" {
  declare class PagefindUI {
      constructor(opts: {
          element?: string | HTMLElement,
          bundlePath?: string,
          pageSize?: number,
          resetStyles?: boolean,
          showImages?: boolean,
          showSubResults?: boolean,
          excerptLength?: number,
          processResult?: any,
          processTerm?: any,
          showEmptyFilters?: boolean,
          debounceTimeoutMs?: number,
          mergeIndex?: any,
          translations?: any,
          autofocus?: boolean,
          sort?: any,
      })
  }
}
