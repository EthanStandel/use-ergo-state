import { useState, useRef, useCallback } from "react";

export type MutableRequiredStateRef<S> = (setStateAction?: Setter<S>) => S;
export type MutableOptionalStateRef<S> = (
  setStateAction?: OptionalSetter<S | undefined>
) => S | undefined;
export type MutableStateRef<S> =
  | MutableRequiredStateRef<S>
  | MutableOptionalStateRef<S>;
export type Setter<S> = ((newState: S) => S) | (S extends Function ? never : S);
export type OptionalSetter<S = undefined> = S extends undefined
  ? never
  : ((newState: S | undefined) => S | undefined) | S;

function useErgoState<S>(
  initialState: S | (() => S)
): MutableRequiredStateRef<S>;
function useErgoState<S = undefined>(): (
  setStateAction?: OptionalSetter<S>
) => MutableOptionalStateRef<S>;
function useErgoState<S>(initialState?: S | (() => S)): MutableStateRef<S> {
  const [state, setState] = useState(initialState);
  const stateRef = useRef(state);

  return useCallback(
    (setStateAction?: OptionalSetter<S | undefined>): S | undefined => {
      if (setStateAction !== undefined) {
        const newStateValue =
          typeof setStateAction === "function"
            ? setStateAction(stateRef.current)
            : setStateAction;
        stateRef.current = newStateValue;
        setState(newStateValue);
        return newStateValue;
      }

      return stateRef.current;
    },
    []
  );
}

export { useErgoState, useErgoState as useState };
