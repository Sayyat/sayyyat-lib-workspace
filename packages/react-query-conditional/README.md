# @sayyyat/react-query-conditional

[![npm version](https://img.shields.io/npm/v/@sayyyat/react-query-conditional.svg)](https://www.npmjs.com/package/@sayyyat/react-query-conditional)
[![CI/CD Status](https://github.com/Sayyat/sayyyat-lib-workspace/actions/workflows/publish.yml/badge.svg)](https://github.com/Sayyat/sayyyat-lib-workspace/actions)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@sayyyat/react-query-conditional)](https://bundlephobia.com/package/@sayyyat/react-query-conditional)
[![License: MIT](https://img.shields.io/npm/l/@sayyyat/react-query-conditional)](https://opensource.org/licenses/MIT)

A simple, zero-dependency, declarative React component to gracefully handle `@tanstack/react-query` states (`isPending`, `isError`, `isEmpty`) without repeating logic.

-----

### The Problem

When using TanStack Query, you often find yourself repeating the same boilerplate logic in every component:

```tsx
function MyComponent() {
  const { data, isPending, isError } = useQuery(...);

  if (isPending) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorState />;
  }

  if (!data || data.length === 0) {
    return <EmptyState />;
  }

  // Finally, the "happy path"
  return <DisplayData data={data} />;
}
```

This is repetitive, imperative, and mixes state logic heavily with your component's presentation.

### The Solution: `<Conditional />`

This component encapsulates all that logic, allowing you to write clean, declarative code.

```tsx
import { Conditional } from '@sayyyat/react-query-conditional';
import { useQuery } from '@tanstack/react-query';

function MyComponent() {
  const query = useQuery(...);

  return (
    <Conditional query={query}>
      {(results) => <DisplayData data={results[0].data} />}
    </Conditional>
  );
}
```

The component automatically handles `isPending`, `isError`, and `isEmpty` states, rendering its `children` (as a function) only for the "happy path".

## Features

* ✅ **Zero-Dependency:** Works out-of-the-box with simple default states. It is **not** dependent on Tailwind or any other styling library.
* ✅ **Fully Customizable:** Easily override the default `skeleton`, `error`, and `empty` components with your own (e.g., Tailwind + i18n components).
* ✅ **Handles Multiple Queries:** Can track an array of queries (`[queryA, queryB]`) and wait for `all` or `any` to complete.
* ✅ **Render Prop API:** Uses the `children-as-a-function` pattern for a clean, declarative API.

## Installation

```bash
# pnpm
pnpm add @sayyyat/react-query-conditional

# yarn
yarn add @sayyyat/react-query-conditional

# npm
npm install @sayyyat/react-query-conditional
```

## Usage

### Basic Example

The component automatically provides built-in (framework-agnostic) components for `skeleton`, `error`, and `empty` states.

```tsx
import { Conditional } from '@sayyyat/react-query-conditional';
const query = useQuery(...);

return (
  <Conditional query={query}>
    {/* This is only rendered on success and when data is not empty */}
    {(results) => (
      <div>
        <h1>{results[0].data.title}</h1>
      </div>
    )}
  </Conditional>
);
```

### Customizing States (for Tailwind, i18n, etc.)

You can easily provide your own components for each state. This is the recommended way to use this library if you use Tailwind/MUI or need internationalization (i18n).

```tsx
import { Conditional } from '@sayyyat/react-query-conditional';
import { MyTailwindSpinner } from '@/components/ui/MySpinner';
import { MyTranslatedError } from '@/components/ui/MyError';
import { MyEmptyState } from '@/components/ui/MyEmptyState';

const query = useQuery(...);

<Conditional
  query={query}
  skeleton={<MyTailwindSpinner />}
  error={<MyTranslatedError message="Деректерді жүктеу кезінде қате орын алды" />}
  empty={<MyEmptyState />}
>
  {(results) => ...}
</Conditional>
```

### Handling Multiple Queries

Use the `queries` prop to wait for multiple requests. Use `mode="all"` (default) to wait for all queries to succeed, or `mode="any"` to render as soon as one succeeds.

```tsx
const userQuery = useQuery({ queryKey: ['user'], ... });
const postsQuery = useQuery({ queryKey: ['posts'], ... });

return (
  <Conditional 
    queries={[userQuery, postsQuery]} 
    mode="all"
  >
    {(results) => {
      const user = results[0].data;
      const posts = results[1].data;
      return <UserProfile user={user} posts={posts} />;
    }}
  </Conditional>
);
```

## API / Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `children` | `ReactNode \| (results: TQ[]) => ReactNode` | **Required** | The content to render on success, or a function that receives the array of query results. |
| `query` | `UseQueryResult` | `undefined` | A single TanStack Query result object. |
| `queries` | `UseQueryResult[]` | `[]` | An array of TanStack Query result objects. |
| `skeleton` | `ReactNode` | `<Loading />` | Component to show while any query `isPending`. |
| `error` | `ReactNode \| (errors: unknown[], results: TQ[]) => ReactNode` | `<ErrorState />` | Component to show if any query `isError`. Can be a function. |
| `empty` | `ReactNode \| (results: TQ[]) => ReactNode` | `<EmptyState />` | Component to show if data is empty (null, undefined, or empty array). |
| `treatErrorAsEmpty` | `boolean` | `true` | If `true`, renders the `empty` component on error instead of the `error` component. Useful for 404s. |
| `requireData` | `boolean` | `true` | If `true`, success requires `data` to be non-null. If `false`, `isSuccess` is enough. |
| `mode` | `"all" \| "any"` | `"all"` | For multiple queries: wait for `all` to succeed or just `any` to succeed. |

*(`TQ` type is `UseQueryResult<any, any>`)*

## License

MIT © [Sayat Raykul](https://www.google.com/search?q=https://github.com/Sayyat)