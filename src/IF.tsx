import * as React from 'react';

export interface CommonProps {
  show?: boolean;
}

export const __NAME_IF__ = 'IF_name_if';
export const __NAME_ELSE_IF__ = 'IF_name_else_if';
export const __NAME_ELSE__ = 'IF_name_else';

// just as a reference varible
const isWrapMark = {};

const injectWrapMark = (component: any) => React.cloneElement(component, { isWrapMark });

export const Wrap: React.SFC<CommonProps> = ({ show = true, children }) => {
  if (!show) {
    return null;
  }

  let hasPassed = false;
  let hasIf = false;

  const renderArray = React.Children.toArray(children).map(child => {
    // @ts-ignore
    if (child && child.type && child.props) {
      // @ts-ignore
      const { props: childProps } = child;
      // @ts-ignore
      const { displayName } = child.type;
      const injectedChild = injectWrapMark(child);
      switch (displayName) {
        case __NAME_IF__: {
          hasIf = true;
          hasPassed = !!childProps.if;
          return hasPassed ? injectedChild : null;
        }
        case __NAME_ELSE_IF__: {
          if (!hasIf) {
            throw new Error('Wrong logical order.');
          }
          if (hasPassed) {
            return null;
          }
          hasPassed = !!childProps.elseIf;
          return hasPassed ? injectedChild : null;
        }
        case __NAME_ELSE__: {
          if (!hasIf) {
            throw new Error('Wrong logical order.');
          }
          // mark end
          hasIf = false;
          return hasPassed ? null : injectedChild;
        }
        default:
          return child;
      }
    }
    return child;
  });

  return <>{renderArray}</>;
};

function getChildComponent<T = {}>(): React.SFC<T> {
  return props => (
    <Wrap
      // @ts-ignore
      show={props.isWrapMark === isWrapMark}
    >
      {props.children}
    </Wrap>
  );
}

export const If: React.SFC<{ if?: boolean }> = getChildComponent();
If.displayName = __NAME_IF__;
export const ElseIf: React.SFC<{ elseIf?: boolean }> = getChildComponent();
ElseIf.displayName = __NAME_ELSE_IF__;
export const Else: React.SFC = getChildComponent();
Else.displayName = __NAME_ELSE__;

export interface RcIF extends React.SFC<CommonProps> {
  If: typeof If;
  ElseIf: typeof ElseIf;
  Else: typeof Else;
}

/**
 * FI is as a wrapper component. `FI` is used to distinguish it from `If`.
 */
export const FI: RcIF = props => <Wrap show={props.show}>{props.children}</Wrap>;

FI.If = If;
FI.ElseIf = ElseIf;
FI.Else = Else;
