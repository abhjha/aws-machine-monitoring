import React from 'react';
import { withRouter } from "react-router-dom";
import back from './back.png';
import './index.css';


class BackButton extends React.Component {

    triggerBack = () => {
        this.props.history.goBack();
    }

    render() {
        return (
        <div className="tkey-back-container" onClick={this.triggerBack}>
            <img src={back} alt='back-icon'></img>
        </div>
    )
}

}
export default withRouter(BackButton);