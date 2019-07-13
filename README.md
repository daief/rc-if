## rc-if

[![Build Status](https://travis-ci.org/daief/rc-if.svg?branch=master)](https://travis-ci.org/daief/rc-if)

rc-if is a react component for writing if-else in render.

## Usage

Install.

```bash
$ npm install @axew/rc-if
# or
$ yarn add @axew/rc-if

```

Example.

```jsx
import { FI, If, ElseIf, Else } from '@axew/rc-if';

const App = () => {
  const { data, error, loading } = useFakeFetch('http://example.com');
  return (
    <FI>
      <h1>Title - this is always visible</h1>
      <If if={loading}>
        <Loading />
      </If>
      <ElseIf elseIf={error}>
        <Error message={error} />
      </ElseIf>
      <Else>
        <If if={data.list.length === 0}>
          <Empty />
        </If>
        <Else>
          <List dataSource={data.list} />
        </Else>
      </Else>
    </FI>
  );
};
```

## Types

```ts
interface RcIF extends React.SFC<{ show?: boolean }> {
  If: React.SFC<{ if?: boolean }>;
  ElseIf: React.SFC<{ elseIf?: boolean }>;
  Else: React.SFC;
}

declare const FI: RcIF;
```

### FI

The following components cannot work without FI wrapping. When use in nested, the following components can also be wrap.

| Property | Description            | Type    | Default |
| -------- | ---------------------- | ------- | ------- |
| show     | render children or not | boolean | true    |

### If

Render when if.

| Property | Description            | Type    | Default |
| -------- | ---------------------- | ------- | ------- |
| if       | render children or not | boolean | -       |

### ElseIf

Render when elseIf.

| Property | Description            | Type    | Default |
| -------- | ---------------------- | ------- | ------- |
| elseIf   | render children or not | boolean | -       |

### Else

Render when else.
