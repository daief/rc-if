import * as React from 'react';

export const getComponent = (content = 'content'): React.SFC => () => <div>{content}</div>;

export const renderComponent = (content = 'content') => React.createElement(getComponent(content));
