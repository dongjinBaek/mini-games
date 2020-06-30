import React, {Component} from 'react';
import {Route, BrowserRouter} from 'react-router-dom';
import TapNumbersBoard from './component/tapNumbers/Board';
import SlideNumbersBoard from './component/slideNumbers/Board';
import TopBar from './component/TopBar';
import BestScores from './component/BestScores'
import MainPage from './component/MainPage';
import './App.css';

class App extends Component {
    state = {
        bestScores: [
            {
                name: 'tapNumbers',
                score: 0,
                lowIsGood: true
            },
            {
                name: 'slideNumbers',
                score: 0,
                lowIsGood: true
            }
        ]
    }
    updateHighScore = (score, name) => {
        const {bestScores} = this.state;
        const game = bestScores.filter((game) => game.name === name);
        if (game.length !== 1) {
            console.warn('game with name ' + name + ' error at App:checkHighScore');
            return;
        }
        if (game[0].score === 0) {
            this.setState({
                bestScores: bestScores.map((game) => (game.name === name ? {...game, score: score} : game))
            });
        } else if (game[0].lowIsGood && score < game[0].score) {
            this.setState({
                bestScores: bestScores.map((game) => (game.name === name ? {...game, score: score} : game))
            });
        } else if (!game[0].lowIsGood && score > game[0].score) {
            this.setState({
                bestScores: bestScores.map((game) => (game.name === name ? {...game, score: score} : game))
            });
        }
    }
    render() {
        const {bestScores} = this.state;
        return(
            <div className='App'>
                <div className='Container'>
                    <BrowserRouter>
                        <Route exact path='/' component={MainPage}/>
                        <Route exact path='/bestScores' render={()=><BestScores bestScores={bestScores}/>}/>
                        <Route path='/game/:name' render={(props) => <TopBar {...props} bestScores={bestScores}/>}/>
                        <Route path='/game/tapNumbers' render={()=><TapNumbersBoard updateHighScore={this.updateHighScore}/>}/>
                        <Route path='/game/slideNumbers' render={()=><SlideNumbersBoard updateHighScore={this.updateHighScore}/>}/>
                    </BrowserRouter>
                </div>
            </div>
        );
    }
}

export default App;
