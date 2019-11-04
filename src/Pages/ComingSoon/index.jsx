import React, { Component } from 'react';
import Button from '../../Component/Button';
import { withRouter } from "react-router-dom";
import './index.css';

class ComingSoon extends Component {

  render() {
    return (
      <div className="coming-soon-container">
        <div className="page-button">
          <Button labelName={'Bin View'} triggerAction={()=>{this.props.history.push({ pathname: '/binView' })}} />
          <Button labelName={'Hopper View'} triggerAction={()=>this.props.history.push({ pathname: '/hopperView' })} />
          <Button labelName={'Blender View'} triggerAction={()=>this.props.history.push({ pathname: '/blenderView' })} />
          <Button labelName={'Finished Goods View'} triggerAction={()=>this.props.history.push({ pathname: '/finishedGoodsView' })} />
        </div>
        <p>{this.props.label} Coming Soon!!!!!!</p>
      </div>
    );
  }
}

export default withRouter(ComingSoon);
