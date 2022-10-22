import { useRouter } from "next/router";
import { mergeRight } from "rambda";
import { useEffect, useState } from "react";
import { deserializeQueryParams } from "../../lib/util";

type useUrlStateOptions<T> = {
  deserialize?: (value: string | string[]) => any;
};

const useUrlState = <T extends { [key: string]: any }>(
  initialValue: T,
  options?: useUrlStateOptions<T>
): [T, (value: ((previousState: T) => T)) => void] => {
  const deserialize = options?.deserialize
    ? options.deserialize
    : deserializeQueryParams;

  const router = useRouter();
  const [state, _setState] = useState(() => {
    const keys = Object.keys(initialValue);

    if (keys.length === 1) {
      const key = keys[0];
      const value = router.query[key];
      if (value) {
        return { [key]: value } as T;
      }
    }

    const stateObj: { [key: string]: any } = {};

    for (const key of keys) {
      const value = router.query[key];
        /* eslint-disable no-eval */
      stateObj[key] = value ? deserialize(value) : initialValue[key];
    }

    return stateObj as T;
  });

  const setState = (value: ((previousState: T) => T)) => {
    _setState((prev) => {
      const newState = typeof value === "function" ? value(prev) : value;
      router.push({ query: mergeRight(router.query, newState) });

      return newState;
    });
  };

  return [state, setState];
};
export default useUrlState;
