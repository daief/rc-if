/**
 * children are only available when condition is true
 */
import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { FI, If, ElseIf, Else } from '../src';
// import { getComponent, renderComponent } from './utils';

describe('Children code should be executed only when condition is true', () => {
  it('FI', () => {
    expect.assertions(2);

    const Func: any = jest.fn(() => <>Mock Child</>);

    renderer.create(
      <FI show={false}>
        <Func />
      </FI>,
    );
    expect(Func.mock.calls.length).toBe(0);

    renderer.create(
      <FI show>
        <Func />
      </FI>,
    );
    expect(Func.mock.calls.length).toBe(1);
  });

  it('FI.If', () => {
    expect.assertions(2);

    const Func: any = jest.fn(() => <>Mock Child</>);

    renderer.create(
      <FI>
        <If>
          <Func />
        </If>
      </FI>,
    );
    expect(Func.mock.calls.length).toBe(0);

    renderer.create(
      <FI>
        <If if>
          <Func />
          <Func />
        </If>
      </FI>,
    );
    expect(Func.mock.calls.length).toBe(2);
  });

  it('FI.ElseIf', () => {
    expect.assertions(2);

    const Func: any = jest.fn(() => <>Mock Child</>);

    renderer.create(
      <FI>
        <If>
          <Func />
        </If>
        <ElseIf>
          <Func />
        </ElseIf>
      </FI>,
    );
    expect(Func.mock.calls.length).toBe(0);

    renderer.create(
      <FI>
        <If />
        <ElseIf elseIf>
          <Func />
          <Func />
        </ElseIf>
      </FI>,
    );
    expect(Func.mock.calls.length).toBe(2);
  });

  it('FI.Else', () => {
    expect.assertions(2);

    const Func: any = jest.fn(() => <>Mock Child</>);

    renderer.create(
      <FI>
        <If>
          <Func />
        </If>
        <ElseIf>
          <Func />
        </ElseIf>
        <Else>
          <Func />
        </Else>
      </FI>,
    );
    expect(Func.mock.calls.length).toBe(1);

    renderer.create(
      <FI>
        <If />
        <ElseIf />
        <Else>
          <Func />
          <Func />
          <Func />
        </Else>
      </FI>,
    );
    expect(Func.mock.calls.length).toBe(4);
  });

  it('Complex', () => {
    const Func: any = jest.fn(() => <>Mock Child</>);
    renderer.create(
      <>
        <FI>
          <If>
            <Func />
          </If>
          <ElseIf>
            <Func />
          </ElseIf>
          <Else>
            {/* 1 */}
            <Func />
          </Else>
        </FI>
        <FI>
          <If>
            <Func />
          </If>
          <Else>
            {/* 1 */}
            <Func />
            <If />
            <ElseIf elseIf>
              {/* 1 */}
              <Func />
            </ElseIf>
          </Else>
        </FI>
      </>,
    );
    expect(Func.mock.calls.length).toBe(3);
  });
});
