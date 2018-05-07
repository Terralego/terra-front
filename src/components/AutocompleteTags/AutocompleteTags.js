import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Input, AutoComplete, Tag, Alert } from 'antd';

const { Option, OptGroup } = AutoComplete;

class AutocompleteTags extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      tags: [],
      value: '',
      alert: false,
    };
  }

  handleChange = value => {
    const options = [].concat(...this.props.options.map(option => option.children));
    const noResult = options
      .filter(child => child.label.toUpperCase().indexOf(value.toUpperCase()) !== -1);

    if (noResult.length > 0) {
      this.setState({ value, alert: true });
    }
  }

  handleFilter = (inputValue, option) => option.props.children
    .toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;

  handleSelect = (value, option) => {
    // New tag added
    if (!this.state.tags.find(tag => option.props.value === tag.value)) {
      const tags = [...this.state.tags, option.props];
      this.setState({ tags });
      this.props.onSelect(tags.map(tag => [tag.value, tag.group]));
    }
    this.setState({ value: '', alert: false });
  }

  handleClose = removedTag => {
    const tags = this.state.tags.filter(tag => tag.value !== removedTag.value);
    this.setState({ tags });
    this.props.onSelect(tags.map(tag => [tag.value, tag.group]));
  }

  render () {
    const options = this.props.options.map(group => (
      <OptGroup key={group.value} label={group.label}>
        {group.children.map(opt => (
          <Option
            key={opt.label}
            value={opt.value}
            label={opt.label}
            group={group.value}
          >
            {opt.label}
          </Option>
        ))}
      </OptGroup>
    ));

    const onFilter = (inputValue, option) => option.props.children
      .toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;

    return (
      <div>
        {this.state.tags.map(tag => (
          <Tag
            closable
            key={`tag_${tag.value}`}
            afterClose={() => this.handleClose(tag)}
            color={this.props.tagColor}
          >{tag.children}
          </Tag>))}
        <AutoComplete
          className={this.props.className}
          dropdownClassName={this.props.dropdownClassName}
          dropdownMatchSelectWidth={false}
          dropdownStyle={{ width: 300 }}
          size={this.props.size}
          style={{ width: '100%' }}
          dataSource={options}
          filterOption={onFilter}
          onChange={this.handleChange}
          onSelect={this.handleSelect}
          value={this.state.value}
        >
          <Input
            suffix={<Icon type={this.props.icon} />}
            placeholder={this.props.placeholder}
          />
        </AutoComplete>

        {
          this.state.alert && this.props.noResult &&
          <Alert
            style={{ margin: '24px 0' }}
            message={this.props.noResult.message}
            description={(
              <p style={{ margin: 0 }}>
                {this.props.noResult.description}
              </p>
            )}
            type="warning"
          />
        }
      </div>
    );
  }
}

AutocompleteTags.propTypes = {
  className: PropTypes.string,
  dropdownClassName: PropTypes.string,
  size: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  onSelect: PropTypes.func.isRequired,
  icon: PropTypes.string,
  placeholder: PropTypes.string,
  noResult: PropTypes.objectOf(PropTypes.string),
  tagColor: PropTypes.string,
};

AutocompleteTags.defaultProps = {
  className: 'autocomplete',
  dropdownClassName: 'autocomplete-dropdown',
  size: 'large',
  icon: 'search',
  placeholder: 'Sélectionner un élément dans la liste',
  noResult: {
    message: 'Aucun élément ne correspond à votre recherche',
    description: 'Essayez avec d\'autres termes',
  },
  tagColor: '',
};

export default AutocompleteTags;
