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
  constructor(public callbacks = new WeakMap<Content, DOMEventCallbacks>()) {}

  observer: MutationObserver = new MutationObserver((list) => {
    for (let mutation of list) {
      for (let added of mutation.addedNodes) {
        this.callbacks.get(added)?.onDOMConnected?.();
      }
      for (let removed of mutation.removedNodes) {
        this.callbacks.get(removed)?.onDOMDisconnected?.();
      }
    }
  });

  /**
   * monitor a DOM tree for lifecylce changes.
   *
   * If the specified handler does not declare any of the required methods
   * no monitoring will be configured for the DOM node.
   */
  monitor(dom: Content, handler: DOMEventCallbacks) {
    if (handler.onDOMConnected || handler.onDOMDisconnected)
      this.callbacks.set(dom, handler);
  }

  static getInstance() {
    if (!monitor) {
      monitor = new DOMMonitor();
      monitor.observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
    return monitor;
  }
}
