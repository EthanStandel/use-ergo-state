import { useState, useRef } from "react";

type Setter<S> = S extends Function
  ? (newState: S) => S
  : ((newState: S) => S) | S;
type OptionalSetter<S = undefined> = S extends undefined
  ? never
  : ((newState: S | undefined) => S | undefined) | S;
function useErgoState<S = undefined>(): (
  setStateAction?: OptionalSetter<S>
) => S | undefined;
function useErgoState<S>(
  initialState: S | (() => S)
): (setStateAction?: Setter<S>) => S;
function useErgoState<S>(
  initialState?: S | (() => S)
): (setStateAction?: OptionalSetter<S>) => S | undefined {
  const [state, setState] = useState(initialState);
  const stateRef = useRef(state);

  return (setStateAction?: OptionalSetter<S>): S | undefined => {
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
  };
}

export { useErgoState, useErgoState as useState };
