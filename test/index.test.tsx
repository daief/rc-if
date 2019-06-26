import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { FI, If, ElseIf, Else } from '../src';

const getComponent = (content = 'content'): React.SFC => () => <div>{content}</div>;

const renderComponent = (content = 'content') => React.createElement(getComponent(content));

describe('FI wrap', () => {
  function renderTest(show: any) {
    const C = getComponent();
    const component = renderer.create(
      <FI show={show}>
        <C />
      </FI>,
    );
    return {
      content: C,
      component,
    };
  }

  it('FI.show => unset', () => {
    const { component, content } = renderTest(undefined);
    expect(component.root.findByType(content).type).toBe(content);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('FI.show => true', () => {
    const { component, content } = renderTest(true);
    expect(component.root.findByType(content).type).toBe(content);
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('FI.show => false', () => {
    const { component, content } = renderTest(false);
    expect(() => component.root.findByType(content)).toThrow();
    expect(component.toJSON()).toMatchSnapshot();
  });
});

describe('FI & If', () => {
  it('If.if => unset', () => {
    const component = renderer.create(
      <FI>
        <If>{renderComponent()}</If>
      </FI>,
    );

    expect(() => component.root.findByType(If)).toThrow();
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('If.if => true', () => {
    const component = renderer.create(
      <FI>
        <If if>{renderComponent()}</If>
      </FI>,
    );

    expect(component.root.findByType(If).type).toBe(If);
    expect(component.toJSON()).toMatchSnapshot();
  });
});

describe('FI & If & ElseIf & Else', () => {
  it('If.if => unset, ElseIf.elseIf => unset, Else', () => {
    const component = renderer.create(
      <FI>
        <If>{renderComponent('if')}</If>
        <ElseIf>{renderComponent('else if')}</ElseIf>
        <Else>{renderComponent('else')}</Else>
      </FI>,
    );

    expect(() => component.root.findByType(If)).toThrow();
    expect(() => component.root.findByType(ElseIf)).toThrow();
    expect(component.root.findByType(Else)).toBeTruthy();
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('If.if => true, ElseIf.elseIf => true, Else', () => {
    const component = renderer.create(
      <FI>
        <If if>{renderComponent('if')}</If>
        <ElseIf elseIf>{renderComponent('else if')}</ElseIf>
        <Else>{renderComponent('else')}</Else>
      </FI>,
    );

    expect(() => component.root.findByType(ElseIf)).toThrow();
    expect(() => component.root.findByType(Else)).toThrow();
    expect(component.root.findByType(If)).toBeTruthy();
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('If.if => false, ElseIf.elseIf => true, Else', () => {
    const component = renderer.create(
      <FI>
        <If>{renderComponent('if')}</If>
        <ElseIf elseIf>{renderComponent('else if')}</ElseIf>
        <Else>{renderComponent('else')}</Else>
      </FI>,
    );

    expect(() => component.root.findByType(If)).toThrow();
    expect(() => component.root.findByType(Else)).toThrow();
    expect(component.root.findByType(ElseIf)).toBeTruthy();
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('If & ElseIf & Else, wrong order', () => {
    const spyFn = spyOn(console, 'error');

    const renderArray = [
      () =>
        renderer.create(
          <FI>
            <ElseIf elseIf />
            <If />
          </FI>,
        ),
      () =>
        renderer.create(
          <FI>
            <Else />
            <If />
          </FI>,
        ),
      () =>
        renderer.create(
          <FI>
            <ElseIf />
          </FI>,
        ),
      () =>
        renderer.create(
          <FI>
            <Else />
          </FI>,
        ),
      () =>
        renderer.create(
          <FI>
            <If />
            <ElseIf />
            <Else />
            <ElseIf />
          </FI>,
        ),
    ];

    renderArray.forEach(renderATest => {
      expect(renderATest).toThrowError(/Wrong logical order/);
    });

    expect(spyFn).toHaveBeenCalled();
    expect(spyFn).toHaveBeenCalledTimes(renderArray.length);
  });

  it('Without FI, render nothing', () => {
    const CArray = Array(4)
      .fill(1)
      .map(() => getComponent());
    const [C1, C2, C3, C4] = CArray;

    const component = renderer.create(
      <>
        <ElseIf>
          <C1 />
        </ElseIf>
        <Else>
          <C2 />
        </Else>
        <If if>
          <C3 />
        </If>
        <C4 />
      </>,
    );

    CArray.forEach((C, i) => {
      if (i < 3) {
        expect(() => component.root.findByType(C)).toThrow();
      } else {
        expect(component.root.findByType(C).type).toBe(C);
      }
    });
    expect(component.toJSON()).toMatchSnapshot();
  });
});

describe('Multiply', () => {
  it('Parallel', () => {
    const CArray = Array(4)
      .fill(1)
      .map((_, i) => getComponent(`content - ${i + 1}`));
    const [C1, C2, C3, C4] = CArray;
    const component = renderer.create(
      <FI>
        <If if>
          <C1 />
        </If>
        <ElseIf elseIf>{renderComponent('else if')}</ElseIf>

        <If>{renderComponent('if')}</If>
        <ElseIf>{renderComponent('else if')}</ElseIf>
        <ElseIf elseIf>
          <C2 />
        </ElseIf>
        <Else>{renderComponent('else')}</Else>

        <If if>
          <C3 />
        </If>

        <If>{renderComponent('if')}</If>
        <ElseIf>{renderComponent('else if')}</ElseIf>
        <ElseIf>{renderComponent('else if')}</ElseIf>
        <Else>
          <C4 />
        </Else>
      </FI>,
    );

    CArray.forEach(C => {
      expect(component.root.findByType(C).type).toBe(C);
    });
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('Nested', () => {
    const CArray = Array(4)
      .fill(1)
      .map((_, i) => getComponent(`content - ${i + 1}`));
    const [C1, C2, C3, C4] = CArray;
    const component = renderer.create(
      <FI>
        <If />
        <ElseIf />
        <Else>
          <If if>
            <C1 />
          </If>
          <If />
          <ElseIf elseIf>
            <C2 />
            <If />
            <Else>
              <If />
              <Else>
                <C3 />
                <If if>
                  <If if>
                    <If if>
                      <If if>
                        <If />
                        <Else>
                          <C4 />
                        </Else>
                      </If>
                    </If>
                  </If>
                </If>
              </Else>
            </Else>
          </ElseIf>
        </Else>
      </FI>,
    );

    CArray.forEach(C => {
      expect(component.root.findByType(C).type).toBe(C);
    });
    expect(component.toJSON()).toMatchSnapshot();
  });
});
