import React, { Component } from "react";
import PropTypes from 'prop-types';
import {Divider, Input, Tree} from "antd";
import EntityTreeNodeEditable from "./EntityTreeNodeEditable";
import EntityTreeNodeAdd from "./EntityTreeNodeAdd";
import styles from "./EntityTree.less";
import { Trans, withI18n } from '@lingui/react';
import EntityTreeNodeReadonly from "./EntityTreeNodeReadonly";
const uuidv1 = require('uuid/v1');

const { TreeNode } = Tree;

@withI18n()
class EntityTree extends Component {

  propTypes = {
    tree: PropTypes.object,
    editable: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.noCancelableElements = {};
    this.state = {
      tree: props.tree,
      selectedNode: null,
      parameterCounter: 1
    }
  }

  onDragEnter(info) {
  }

  onDrop = (info) => {
    if (info.node.isDisabled()) {
      return;
    }
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;

    const attributes = this.state.tree.attributes;

    const dragAttribute = attributes.find(attribute => (attribute.id || attribute.pseudoId) === dragKey);
    // TODO DELETE COMMENT
    console.log("dragAttribute", dragAttribute);
    const dropAttribute = attributes.find(attribute => (attribute.id || attribute.pseudoId) === dropKey);
    // TODO DELETE COMMENT
    console.log("dropAttribute", dragAttribute);

    let dropIndex = attributes.indexOf(dropAttribute);
    // TODO DELETE COMMENT
    console.log("dropIndex", dropIndex);
    let dragIndex = attributes.indexOf(dragAttribute);
    // TODO DELETE COMMENT
    console.log("dragIndex", dragIndex);
    dragAttribute.parentId = info.dropToGap ? dropAttribute.parentId : dropAttribute.id || dropAttribute.pseudoId;

    const levelAttributes = attributes.filter(attribute => attribute.parentId === dragAttribute.parentId);
    const dropToGapAfter = info.dropToGap && info.dropPosition + 1 > levelAttributes.indexOf(dropAttribute);
    const dropAfter = dropIndex > dragIndex;

    debugger;
    attributes.splice(dragIndex, 1);
    // TODO DELETE COMMENT
    console.log("Extend Index", dropIndex + (dropToGapAfter < dragIndex ? 1 : 0) + (dropAfter ? 0 : 0));
    if (info.dropToGap) {
      debugger;
      attributes.splice(dropIndex + (dropAfter ? -1 : 0) + (dropToGapAfter ? 1 : 0), 0, dragAttribute);
    } else {
      attributes.push(dragAttribute);
    }
    this.setState({tree: this.state.tree});
  }

  addChildren(parentId) {
    this.setState({
      tree: {
        ...this.state.tree,
        attributes: [...this.state.tree.attributes, {
          name: `New parameter ${this.state.parameterCounter}`, parentId, pseudoId: uuidv1()
        }]
      },
      parameterCounter: this.state.parameterCounter + 1
    });
  }

  deleteChildren(attributeToDelete) {
    const childrenAttributes = this.state.tree.attributes.filter(
      attr => attr.parentId === (attributeToDelete.id || attributeToDelete.pseudoId)
    );

    let deleteConfirmed = false;
    if (childrenAttributes.length > 0) {
      let items
      // TODO modal is it ok
      // traverse end delete
      deleteConfirmed = confirm("Realy?");
    }
    if( childrenAttributes.length === 0 || deleteConfirmed) {
      this.setState({
        tree: {
          ...this.state.tree,
          attributes: this.state.tree.attributes.filter(
            attr => (attr.id || attr.pseudoId) !== (attributeToDelete.id || attributeToDelete.pseudoId)
          )
        }
      });
    }
  }

  renderEntityTreeNode(attributes, parentId = null) {
    const nodes = [];

    // Children
    for (const attribute of attributes.filter(attribute => attribute.parentId === parentId)) {
      let entityTreeNode;
      if (this.props.editable) {
        entityTreeNode = <EntityTreeNodeEditable item={attribute} onDelete={() => this.deleteChildren(attribute)}/>;
      } else {
        entityTreeNode = <EntityTreeNodeReadonly item={attribute} />;
      }

      const children = attributes.filter(subAttribute => subAttribute.parentId === attribute.id || attribute.pseudoId);
      console.log(children);

      nodes.push((
        <TreeNode key={ attribute.id || attribute.pseudoId } title={entityTreeNode} disabled={!this.props.editable}>
          {children.length && this.renderEntityTreeNode(attributes, attribute.id || attribute.pseudoId )}
        </TreeNode>
      ));
    }

    if (this.props.editable && (nodes.length > 0 || !parentId)) {
      const add = (<Divider className={"add-button"}>
        <EntityTreeNodeAdd onClick={() => { this.addChildren(parentId)}} />
      </Divider>);
      nodes.push(<TreeNode key={ `${parentId}-add` } title={add} disabled={true} />);
    }
    return nodes;
  };

  render() {

    return (
      <div>
        { this.props.editable ?
          <Input size="large" placeholder="Entity name" defaultValue={this.state.tree.name}/> :
          <h2>{this.props.tree.name}</h2>
        }
        <Tree
          defaultExpandAll={true}
          draggable
          blockNode
          onDragEnter={this.onDragEnter}
          autoExpandParent={false}
          onDrop={this.onDrop}
          className={styles.entityTree}
        >
          {this.renderEntityTreeNode(this.state.tree.attributes)}
        </Tree>
      </div>
    );
  }
}

export default EntityTree;
