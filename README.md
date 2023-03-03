# 🛌 `use-ergo-state`

This library is meant to be a drop-in replacement for `useState` that provides a more ergonomic API for working with state in React.

## Installation

```sh
# npm
npm i use-ergo-state
# yarn
yarn add use-ergo-state
# pnpm
pnpm add use-ergo-state
```

This package uses the `useRef` & `useState` primitive hooks from React, so React is still required as a `peerDependency`.

## Why `useErgoState`?

React's API for `useState` has several ergonomic issues from a DX perspective, including but not limited to: the awkwardness of having to reference your variable name twice, and the oddity of destructuring a tuple. It's model also forces the developer to manage and consider stale state on a regular basis. Signal based APIs like `@preact/signals-react` have been proposed as a solution for this problem. However, utilizing the signal primitive forces us to rethink the mental model of a React application. The `useErgoState` hook is intended to allow React developers to continue to enjoy the DX benefits of the virtual DOM while still providing some of the benefits seen in signal based APIs like `@preact/signals` and `solid-js`.

## How it works

The traditional `useState` hook returns a tuple of two values. The first element in the tuple is the state value for the current render, and the second element in the tuple is a setter for the next state value which also triggers a rerender.

In `useErgoState`, a single value is returned. That value is a function which can be called to get the current state value, and can also be called with a new state value to set the next state.

### `useErgoState` in a component

#### Counter

```tsx
const Counter = () => {
  const count = useErgoState(0);

  return (
    <div>
      <p>Count: {count()}</p>
      <button onClick={() => count(count() + 1)}>Increment</button>
    </div>
  );
};
```

#### `setInterval` with no stale state

```tsx
const Timer = () => {
  const time = useErgoState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      time(time() + 1); // no stale state!
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>Time: {time()}</div>
  );
}
```

```tsx
import { useState } from "use-ergo-state"; // can also be imported as `useState` if you prefer!

const NameInput = () => {
  const firstName = useState("");
  const firstName = useState("");
  // you can still use inline derived state, unlike with signals
  const fullName = `${firstName()} ${lastName()}`;

  return (
    <>
      <label>
        First name
        <input value={firstName()} onChange={e => firstName(e.target.value)} />
      </label>
      <label>
        Last name
        <input value={lastName()} onChange={e => lastName(e.target.value)} />
      </label>
      <p>Full name: {fullName}</p>
    </>
  );
}
```

### Isn't the name `useErgoState` _not very ergonomic_?

It isn't. But this package also exports `useErgoState` as `useState` if you prefer to just use that name. The `useErgoState` name is mostly just there to differentiate it from the React's `useState` and to make auto-importing slightly easier.

### Known footguns

Because the value returned by `useErgoState` acts as both a getter & setter function, the default behavior is to return the current state value when called without any arguments. If you need to manually update the state value to `undefined`, you must do so by passing `() => undefined` to the setter function. Otherwise, no state update will occur.

### TypeScript support

The `useErgoState` hook is written directly in TypeScript and is safely typed.

### Special thanks to [`S.js`](https://github.com/adamhaile/S) for the inspiration to make this API!
