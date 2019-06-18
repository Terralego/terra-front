import React from 'react';
import PropTypes from 'prop-types';
import marked from 'marked';
import nunjucks from 'nunjucks';
import slugify from 'slugify';
import { Parser, ProcessNodeDefinitions } from 'html-to-react';

import HistoryLink from '../HistoryLink';

const DEFAULT_ENV = nunjucks.configure();
DEFAULT_ENV.addFilter('slug', value => slugify(`${value || ''}`.toLowerCase()));

export const Template = ({
  env = DEFAULT_ENV,
  template,
  content = '',
  history,
  customComponents = [],
  ...props
}) => {
  const source = marked(template
    ? env.renderString(template, props)
    : content);

  const processNodeDefinitions = new ProcessNodeDefinitions(React);

  return new Parser().parseWithInstructions(
    source,
    () => true,
    [{
      replaceChildren: false,
      shouldProcessNode: node => history && node.name && node.name === 'a',
      processNode: (node, children) => (
        <HistoryLink {...node.attribs} history={history}>{children}</HistoryLink>
      ),
    }, ...customComponents.map(spec => {
      const { tagName, autoClose, component: Component } = spec;
      return spec.processNode
        ? spec
        : {
          replaceChildren: false,
          shouldProcessNode: node => node.name && node.name === tagName,
          processNode: (node, children) => (
            <>
              <Component {...node.attribs}>{!autoClose && children}</Component>
              {autoClose && children}
            </>
          ),
          ...spec,
        };
    }), {
      shouldProcessNode: () => true,
      processNode: processNodeDefinitions.processDefaultNode,
    }],
  ) || null;
};

Template.propTypes = {
  /** Custom instance of nunjucks */
  env: PropTypes.instanceOf(nunjucks),
  /** Template to render (optional) */
  template: PropTypes.string,
  /** Content to display (mandatory if template is not given) */
  content: PropTypes.string,
  /** history prop from your favorite router lib. Will be use to
   * replace internal links if present
   */
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  /**
   * Custom components definitions
   * See https://www.npmjs.com/package/html-to-react#examples
   * for more infos
   */
  customComponents: PropTypes.arrayOf(PropTypes.shape({
    replaceChildren: PropTypes.bool,
    shouldProcessNode: PropTypes.func,
    processNode: PropTypes.func,
    /** Shortcut to declare a tagname with a single string */
    tagName: PropTypes.string,
    /** Tag is autoclose */
    autoClose: PropTypes.bool,
    /** Shortcut to declare a component with a single function */
    component: PropTypes.func,
  })),
  /**
   * Any other props will be given to template renderer
  */
};

export default Template;
