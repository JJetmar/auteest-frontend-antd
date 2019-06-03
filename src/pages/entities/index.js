import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col} from 'antd'
import { Color } from 'utils'
import { Page, ScrollBar } from 'components'
import { GGEditor} from './components';

import styles from './index.less'
import EntityTree from "../../components/EntityTree/EntityTree";

GGEditor.setTrackable(false);


@connect(({ app, loading }) => ({
  avatar: app.user.avatar,
  username: app.user.username,
  loading,
}))
class Dashboard extends PureComponent {
  render() {
    const { loading } = this.props

    const trueStructure = {
      "id":"5ce2e96ff59b300a7c5a6be7",
      "name":"čau čadddddu",
      "description":"je je",
      "attributes":[
        {"id":"579e736be78170191f4485b4","required":true,"description":"My description","name":"Hruška","parentId":null,"declaration":{"type":"string"}},
        {"id":"5ce2e96ff59b300a7c5a6be5","required":true,"description":"My description","name":"Citron","parentId":"579e736be78170191f4485b4","declaration":{"type":"string"}},
        {"id":"5ce2e96ff59b300a7c5a6be6","required":true,"description":"My description","name":"Pomeranč","parentId":null,"declaration":{"type":"string"}},
        {"id":"5ce2e96ff59b300a7c5a6be7","required":true,"description":"My description","name":"Jablko","parentId":"579e736be78170191f4485b4","declaration":{"type":"string"}},
        {"id":"5ce2e96ff59b300a7c5a6be8","required":true,"description":"My description","name":"Meloun","parentId":"579e736be78170191f4485b4","declaration":{"type":"string"}}
      ]};

    return (
      <Page
        // loading={loading.models.dashboard && sales.length === 0}
        className={styles.dashboard}
      >
        <Row gutter={24}>
          <Col md={24}>
            <Page inner>
              <EntityTree tree={trueStructure} editable={true}/>
              <h1>NonEditable</h1>
              <EntityTree tree={trueStructure}/>
            </Page>
          </Col>
        </Row>
      </Page>
    )
  }
}

Dashboard.propTypes = {
  avatar: PropTypes.string,
  username: PropTypes.string,
  dashboard: PropTypes.object,
  loading: PropTypes.object,
}

export default Dashboard
