import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import BinView from './Pages/BinView/index';
import HopperView from './Pages/HopperView/index';
import AlertView from './Pages/Alerts/index';
import ControlTowerView from './Pages/ControlTower/index';
import PlantView from './Pages/PlantView/index';
import Menu from './Component/Menu';
import AnalyticsView from './Pages/Analytics/index';
import BlenderView from './Pages/BlenderView/index';
import FinishedGoodsView from './Pages/FinishedGoodsView/index';
import LineView from './Pages/LineView/index';
import LaborCorrelation from './Pages/LaborCorrelation';
import SetPointOptimization from './Pages/SetPointOptimization';
import PredictiveMaintenace from './Pages/PredictiveMaintenace';
import RateOptimization from './Pages/RateOptimization';
import RawMaterialInsights from './Pages/RawMaterialInsights';
import './index.css';
import './SCSS/main.scss';


class App extends React.Component {


  render (){
    return (
      <Router>
          <Menu />
          
        <div>
          <Route path="/binView" exact component={BinView} />
          <Route path="/hopperView" exact component={HopperView} />
          <Route path="/blenderView" exact component={BlenderView} />
          <Route path="/alerts" exact component={AlertView} />
          <Route path="/controlTower" exact component={ControlTowerView} />
          <Route path="/" exact component={PlantView} />
          <Route path="/lineView" exact component={LineView} />
          <Route path="/analytics" exact component={AnalyticsView} />
          <Route path="/finishedGoodsView" exact component={FinishedGoodsView} />
          <Route path="/laborCorrelation" exact component={LaborCorrelation} />
          <Route path="/setpointOptimization" exact component={SetPointOptimization} />
          <Route path="/predictiveMaintenace" exact component={PredictiveMaintenace} />
          <Route path="/rateOptimization" exact component={RateOptimization} />
          <Route path="/rawMaterial" exact component={RawMaterialInsights} />
        </div>
      </Router>
    )
  }
}

export default App;