/**
 * Type definitions for htmx 2.x
 * https://htmx.org
 */

interface HtmxConfig {
  historyEnabled?: boolean;
  historyCacheSize?: number;
  refreshOnHistoryMiss?: boolean;
  defaultSwapStyle?: string;
  defaultSwapDelay?: number;
  defaultSettleDelay?: number;
  includeIndicatorStyles?: boolean;
  indicatorClass?: string;
  requestClass?: string;
  addedClass?: string;
  settlingClass?: string;
  swappingClass?: string;
  allowEval?: boolean;
  allowScriptTags?: boolean;
  inlineScriptNonce?: string;
  attributesToSettle?: string[];
  withCredentials?: boolean;
  timeout?: number;
  wsReconnectDelay?: string | ((retryCount: number) => number);
  wsBinaryType?: string;
  disableSelector?: string;
  useTemplateFragments?: boolean;
  scrollBehavior?: string;
  defaultFocusScroll?: boolean;
  getCacheBusterParam?: boolean;
  globalViewTransitions?: boolean;
  methodsThatUseUrlParams?: string[];
  selfRequestsOnly?: boolean;
  ignoreTitle?: boolean;
  scrollIntoViewOnBoost?: boolean;
  triggerSpecsCache?: Record<string, unknown> | null;
}

interface HtmxRequestConfig {
  boosted: boolean;
  useUrlParams: boolean;
  formData: FormData;
  parameters: Record<string, unknown>;
  unfilteredParameters: Record<string, unknown>;
  headers: Record<string, string>;
  target: HTMLElement;
  verb: string;
  errors: unknown[];
  withCredentials: boolean;
  timeout: number;
  path: string;
  triggeringEvent: Event | null;
}

interface HtmxSwapDetail {
  target: HTMLElement;
  elt: HTMLElement;
  requestConfig: HtmxRequestConfig;
  xhr: XMLHttpRequest;
  pathInfo: {
    requestPath: string;
    finalRequestPath: string;
    responsePath: string | null;
    anchor: string | null;
  };
}

interface HtmxAfterSwapEvent extends CustomEvent {
  detail: HtmxSwapDetail;
}

interface HtmxBeforeSwapEvent extends CustomEvent {
  detail: HtmxSwapDetail & {
    shouldSwap: boolean;
    serverResponse: string;
    isError: boolean;
  };
}

interface HtmxLoadEvent extends CustomEvent {
  detail: {
    elt: HTMLElement;
  };
}

interface Htmx {
  config: HtmxConfig;
  on(eventName: string, handler: (event: CustomEvent) => void): void;
  off(eventName: string, handler: (event: CustomEvent) => void): void;
  trigger(elt: HTMLElement | string, eventName: string, detail?: unknown): void;
  process(elt: HTMLElement): void;
  ajax(
    verb: string,
    path: string,
    element: HTMLElement | string | Record<string, unknown>
  ): Promise<void>;
  find(selector: string): HTMLElement | null;
  find(elt: HTMLElement, selector: string): HTMLElement | null;
  findAll(selector: string): NodeList;
  findAll(elt: HTMLElement, selector: string): NodeList;
  closest(elt: HTMLElement, selector: string): HTMLElement | null;
  values(elt: HTMLElement, type?: string): Record<string, unknown>;
  remove(elt: HTMLElement, delay?: number): void;
  addClass(elt: HTMLElement, clazz: string, delay?: number): void;
  removeClass(elt: HTMLElement, clazz: string, delay?: number): void;
  toggleClass(elt: HTMLElement, clazz: string): void;
  takeClass(elt: HTMLElement, clazz: string): void;
  defineExtension(name: string, extension: Record<string, unknown>): void;
  removeExtension(name: string): void;
  logAll(): void;
  logNone(): void;
  logger: ((elt: HTMLElement, event: string, data: unknown) => void) | null;
}

// Extend the global Window interface
interface Window {
  htmx: Htmx;
}

// Extend HTMLElement event map for htmx events
interface HTMLElementEventMap {
  'htmx:load': HtmxLoadEvent;
  'htmx:afterSwap': HtmxAfterSwapEvent;
  'htmx:beforeSwap': HtmxBeforeSwapEvent;
  'htmx:configRequest': CustomEvent;
  'htmx:beforeRequest': CustomEvent;
  'htmx:afterRequest': CustomEvent;
  'htmx:responseError': CustomEvent<{ xhr: XMLHttpRequest; requestConfig: HtmxRequestConfig }>;
  'htmx:sendError': CustomEvent<{ requestConfig: HtmxRequestConfig }>;
  'htmx:timeout': CustomEvent;
  'htmx:pushedIntoHistory': CustomEvent;
  'htmx:replacedInHistory': CustomEvent;
  'htmx:historyRestore': CustomEvent;
}
