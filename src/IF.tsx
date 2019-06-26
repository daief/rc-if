import * as React from 'react';

export interface CommonProps {
  show?: boolean;
}

export interface RcIF extends React.SFC<CommonProps> {
  If: React.SFC<{ if?: boolean }>;
  ElseIf: React.SFC<{ elseIf?: boolean }>;
  Else: React.SFC;
}

export const __NAME_IF__ = 'IF_name_if';
export const __NAME_ELSE_IF__ = 'IF_name_else_if';
export const __NAME_ELSE__ = 'IF_name_else';

export const ctx = React.createContext<boolean>(false);

export const Wrap: React.SFC<CommonProps> = ({ show = true, children }) => {
  if (!show) {
    return null;
  }

  return (
    <ctx.Consumer>
      {isInnerCtx => {
        if (!isInnerCtx) {
          return null;
        }

        const array = React.Children.toArray(children);
        let hasPassed = false;
        let hasIf = false;

        const renderArray = array.map(child => {
          // @ts-ignore
          if (child && child.type && child.props) {
            // @ts-ignore
            const { props: childProps } = child;
            // @ts-ignore
            const { displayName } = child.type;
            switch (displayName) {
              case __NAME_IF__: {
                hasIf = true;
                hasPassed = !!childProps.if;
                return hasPassed ? child : null;
              }
              case __NAME_ELSE_IF__: {
                if (!hasIf) {
                  throw new Error('Wrong logical order.');
                }

                if (hasPassed) {
                  return null;
                }
                hasPassed = !!childProps.elseIf;
                return hasPassed ? child : null;
              }
              case __NAME_ELSE__: {
                if (!hasIf) {
                  throw new Error('Wrong logical order.');
                }
                // mark end
                hasIf = false;
                return hasPassed ? null : child;
              }
              default:
                return child;
            }
          }
          return child;
        });

        return <>{renderArray}</>;
      }}
    </ctx.Consumer>
  );
};

/**
 * FI is as a wrapper component. `FI` is used to distinguish it from `If`.
 */
export const FI: RcIF = props => (
  <ctx.Provider value={true}>
    <Wrap show={props.show}>{props.children}</Wrap>;
  </ctx.Provider>
);

FI.If = ({ children }) => <Wrap show>{children}</Wrap>;
FI.If.displayName = __NAME_IF__;
FI.ElseIf = ({ children }) => <Wrap show>{children}</Wrap>;
FI.ElseIf.displayName = __NAME_ELSE_IF__;
FI.Else = ({ children }) => <Wrap show>{children}</Wrap>;
FI.Else.displayName = __NAME_ELSE__;
