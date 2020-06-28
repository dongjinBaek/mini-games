import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './BestScores.css';

class BestScores extends Component {
    static defaultProps = {
        bestScores: []
    }
    render() {
        const bestScores = this.props.bestScores;
        const bestScoreLists = bestScores.map((game) => 
            (<div key={game.name}><span>{game.name} : {game.score === 0 ? 'None' : game.score}</span></div>)
        );
        return (
            <div className='BestScores'>
                <div><Link to='/'>To Main</Link></div>
                {bestScoreLists}
            </div>
        );
    }
}

export default BestScores;