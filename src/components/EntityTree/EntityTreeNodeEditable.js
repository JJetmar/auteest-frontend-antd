import React, { Component } from 'react';
import {Select, Input, InputNumber, Checkbox, Button, Row, Col} from 'antd';
import PropTypes from 'prop-types';
import { Trans, withI18n, I18n } from '@lingui/react'
import { simpleTypes } from '../../models/json-schema';
import EntityTreeNodeReadonly from "./EntityTreeNodeReadonly";

const { Option } = Select;
const InputGroup = Input.Group;

@withI18n()
class EntityTreeNodeEditable extends Component {

  propTypes = {
    name: PropTypes.string,
    item: PropTypes.any,
    onDelete: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.noCancelableElements = {};
    this.cancelableElements = {};
    this.state = {
      inEdit: false,
      item: {
        ...props.item,
        declaration: { ...(props.item.declaration || {type: "string"}) },
        required: props.item.required || false
      }
    }
  }

  getInitialState() {
    return {
      item: {
        declaration: {
          type: "string"
        }
      }
    };
  }

  componentWillMount() {
    document.addEventListener("mousedown", this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClick, false);
  }

  handleClick = (e) => {
   e.stopPropagation();


    const cancelableElements = Object.values(this.cancelableElements);
    for (const element of cancelableElements) {
      if(!element)
        return false;

      if (element.contains && element.contains(e.target)) {
        return false;
      }
    }

    const noCancelableElements = Object.values(this.noCancelableElements);
    const foundWrapper = noCancelableElements.find(element => {
      if(!element)
        return false;

      if (element.contains){
        return element.contains(e.target)
      }
      if (element.rcSelect && element.rcSelect.getPopupDOMNode()) {
        return element.rcSelect.getPopupDOMNode().contains(e.target);
      }
      return false
    });

    this.setState({inEdit: !!foundWrapper});
  }

  toggleRequired() {
    this.setState({ item: { ...this.state.item, required: !this.state.item.required }});
  }

  render() {

    return (
      <div ref={node=> this.noCancelableElements.node = node}>
        <Row type="flex" style={{flexWrap: "nowrap"}}>
          <Col style={{width: "100%"}}>
          { this.state.inEdit ?
          <InputGroup compact>
            <Input
              placeholder="Parameter name"
              defaultValue={this.state.item.name}
              style={{width: '20%'}}
              onChange={(event) => this.setState({item: {...this.state.item, name: event.target.value}})}
            />
            <Select
              defaultValue={this.state.item.declaration.type}
              style={{width: 350}}
              ref={el => this.noCancelableElements.type = el}
              onSelect={(value) => this.setState({item: {...this.state.item, declaration: { ...this.state.item.declaration, type: value}}})}
            >
              {
                Object.keys(simpleTypes).map(type => (
                  <Option key={type} value={type}>
                    { simpleTypes[type] }
                  </Option>
                ))
              }
            </Select>
            <Checkbox
              checked={this.state.item.required || false}
              onChange={() => this.toggleRequired()}
            >
              Required
            </Checkbox>
            { // Reference
              this.state.item.declaration.type === "reference" ?
            <Select
              showSearch
              placeholder={this.props.placeholder}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              notFoundContent={null}
            >
            }
            </Select> : ""
          }
          </InputGroup> : <EntityTreeNodeReadonly item={this.state.item} />
        }
        </Col>
        <Col style={{width: "auto"}}>
          <div ref={node=> this.cancelableElements.options = node}>
            <Button
              icon="close"
              size={"small"}
              onClick={() => this.props.onDelete()}/>
          </div>
        </Col>
      </Row>
      {this.state.inEdit ?
        <Row>
          <Col>
          { this.state.item.declaration.type === "string" ?
            <div>
              <span className="ant-input-group-wrapper">
                <span className="ant-input-wrapper ant-input-group">
                  <span className="ant-input-group-addon">Minimal length</span>
                  <InputNumber min={0} defaultValue={0} />
                </span>
              </span>
              <span className="ant-input-group-wrapper">
                <span className="ant-input-wrapper ant-input-group">
                  <span className="ant-input-group-addon">Maximal length</span>
                  <InputNumber />
                </span>
              </span>
            </div> : ""
          }
          </Col>
        </Row> : ""
      }
      </div>
    );
  };
}

export default EntityTreeNodeEditable;
