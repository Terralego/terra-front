import React from 'react';
import renderer from 'react-test-renderer';
import slugify from 'slugify';
import Template from './Template';
import HistoryLink from '../HistoryLink';


jest.mock('../HistoryLink', () => jest.fn(({ children }) => (
  <a data-is-history-link href="/">{children}</a>
)));
jest.mock('slugify');

beforeEach(() => HistoryLink.mockClear());

it('should display content', () => {
  const tree = renderer.create(
    <Template
      content="Hello World"
    />,
  );
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should compile from a template', () => {
  const tree = renderer.create(
    <Template
      template="This {{foo}} is a {{bar}}"
      foo="FOO"
      bar="BAR"
    />,
  );
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should compile custom link', () => {
  const tree = renderer.create(
    <Template
      template={'<a href="foo">foo</a>'}
      history={{
        push () {},
      }}
    />,
  );
  expect(tree.toJSON()).toMatchSnapshot();
  expect(HistoryLink).toHaveBeenCalled();
});

it('should not compile custom link', () => {
  const tree = renderer.create(
    <Template
      template={'<a href="foo">foo</a>'}
    />,
  );
  expect(tree.toJSON()).toMatchSnapshot();
  expect(HistoryLink).not.toHaveBeenCalled();
});


it('should slugify a string', () => {
  renderer.create(
    <Template
      template={'<p>{{foo | slug}}</p>'}
      foo="Foo bar 42"
    />,
  );
  expect(slugify).toHaveBeenCalledWith('foo bar 42');
});

it('should slugify an empty string', () => {
  renderer.create(<Template
    template="<p>{{foo | slug}}</p>"
  />);
  expect(slugify).toHaveBeenCalledWith('');
});

it('should process custom tags with simple spec', () => {
  const CustomTag = ({ children }) => (
    <div>{children}</div>
  );
  const tree = renderer.create(
    <Template
      template={'<custom-tag>Hello world</custom-tag>'}
      customComponents={[{
        tagName: 'custom-tag',
        component: CustomTag,
      }]}
    />,
  );
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should process custom tags with full spec', () => {
  const CustomTag = ({ children }) => (
    <div>{children}</div>
  );
  const tree = renderer.create(
    <Template
      template={'<custom-tag>Hello world</custom-tag>'}
      customComponents={[{
        shouldProcessNode: node => node.name === 'custom-tag',
        processNode: (node, children) => (
          <CustomTag>{children}</CustomTag>
        ),
      }]}
    />,
  );
  expect(tree.toJSON()).toMatchSnapshot();
});
