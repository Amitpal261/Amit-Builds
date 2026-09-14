"use client";

import { useEffect } from "react";

type Replacer = ((key: string, value: unknown) => unknown) | (number | string)[] | null;

export default function ClientSafetyGuard() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Safe JSON.stringify guard to prevent circular structure errors
    const nativeStringify = JSON.stringify;
    JSON.stringify = function (
      value: unknown,
      replacer?: Replacer,
      space?: string | number
    ): string {
      try {
        return nativeStringify(value, replacer as never, space);
      } catch (err: unknown) {
        if (
          err instanceof TypeError &&
          (err.message.includes("circular") || err.message.includes("Converting circular structure"))
        ) {
          const seen = new WeakSet();
          return nativeStringify(
            value,
            (key: string, val: unknown) => {
              if (typeof val === "object" && val !== null) {
                if (typeof Element !== "undefined" && val instanceof Element) {
                  return `[DOMElement: <${val.tagName.toLowerCase()}${val.className ? ` class="${val.className}"` : ""}>]`;
                }
                if (seen.has(val)) {
                  return "[Circular]";
                }
                seen.add(val);
              }
              return typeof replacer === "function" ? replacer(key, val) : val;
            },
            space
          );
        }
        throw err;
      }
    };

    // 2. Safe console.warn / console.error guard to avoid passing raw DOM nodes to iframe bridges
    const nativeWarn = console.warn;
    console.warn = function (...args: unknown[]) {
      const sanitizedArgs = args.map((arg) => {
        if (typeof Element !== "undefined" && arg instanceof Element) {
          return `<${arg.tagName.toLowerCase()}${arg.id ? ` id="${arg.id}"` : ""}${arg.className ? ` class="${arg.className}"` : ""}>`;
        }
        return arg;
      });
      nativeWarn.apply(console, sanitizedArgs);
    };

    return () => {
      JSON.stringify = nativeStringify;
      console.warn = nativeWarn;
    };
  }, []);

  return null;
}
