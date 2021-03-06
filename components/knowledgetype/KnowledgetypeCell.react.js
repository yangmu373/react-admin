/**
 * KnowledgetypeCellComponent
 */
'use strict';

var React = require('react');
var Link = require('react-router').Link;

var KnowledgetypeActions = require('../../actions/KnowledgetypeActions');

var KnowledgetypeCell = React.createClass({

  getInitialState: function() {
    return {del: false};
  },

  componentWillReceiveProps: function() {
    var del = false;
    this.setState({del: del});
  },

  _onDel: function() {
    var del = true;
    this.setState({del: del});
    var data = this.props.data;
    KnowledgetypeActions.del(data);
    return;
  },

  render: function() {
    var trClassName = this.state.del ? "disabled": "";
    var btnClassName = this.state.del ? "ui disabled button": "ui button";
    var lkEdit = "/knowledgetype/edit/" + this.props.data.id;
    return (
      <tr className={trClassName}>
        <td>{this.props.data.category}</td>
        <td>{this.props.data.name}</td>
        <td>{this.props.data.subtitle}</td>
        <td>
          <Link to={lkEdit} className="ui button" type="button">修改</Link>
          <input className={btnClassName} onClick={this._onDel} type="button" value="删除" />
        </td>
      </tr>
    );
  }

});

module.exports = KnowledgetypeCell;
