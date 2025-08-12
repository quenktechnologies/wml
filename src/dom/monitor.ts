import { Content } from "..";

export type Handler = () => void;

/**
 * DOMEventCallbacks is an object interested in receiving the lifecycle
 * events of a DOM tree.
 */
export interface DOMEventCallbacks {
  onDOMConnected?: () => void;

  onDOMDisconnected?: () => void;
}

let monitor: DOMMonitor;

/**
 * DOMMonitor is used to allow WML components to execute code when added or
 * removed from DOM.
 *
 * This constructor is not used directly, instead components must use the
 * getInstance() static method.
 */
export class DOMMonitor {
  constructor(
    public connectHandlers = new WeakMap<Content, Handler>(),
    public disconnectHandlers = new WeakMap<Content, Handler>(),
  ) {}

  _observer: MutationObserver = new MutationObserver((list) => {
    for (let mutation of list) {
      (this._checkAndDispatch(this.connectHandlers, mutation.addedNodes),
        this._checkAndDispatch(this.disconnectHandlers, mutation.removedNodes));
    }
  });

  static getInstance() {
    if (!monitor) {
      monitor = new DOMMonitor();
      monitor.init();
    }
    return monitor;
  }

  _checkAndDispatch(handlers: WeakMap<Content, Handler>, dom: NodeList) {
    let stack = [...dom];
    while (stack.length) {
      let next = <Element>stack.pop();
      if (!next.children) continue;
      stack.push(...next.children);
      handlers.get(next)?.();
    }
  }

  init() {
    this._observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  /**
   * monitor a DOM tree for lifecylce changes.
   *
   * If the specified handler does not declare any of the required methods
   * no monitoring will be configured for the DOM node.
   */
  monitor(dom: Content, handler: DOMEventCallbacks) {
    if (handler.onDOMConnected)
      this.connectHandlers.set(dom, ()=>handler.onDOMConnected?.());

    if (handler.onDOMDisconnected)
      this.disconnectHandlers.set(dom, ()=>handler.onDOMDisconnected?.());
  }
}
