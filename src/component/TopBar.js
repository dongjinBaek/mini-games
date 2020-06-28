import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './TopBar.css';

class TopBar extends Component {
    static defaultProps = {
        bestScores: []
    }

    render() {
        const {bestScores} = this.props;
        const game = bestScores.filter((game) => (game.name === this.props.match.params.name));
        let best = 'None';
        if (game.length !== 1) {
            console.warn('TopBar game name not match');
        } else if (game[0].score !== 0) {
            best = game[0].score;
        }
        return (
            <div className='TopBarDiv'>
                <span className='Main'><Link to='/' className='MainLink'>To Main</Link></span>
                <span className='Best'>Best : {best}</span> 
            </div>

        )
    }
}

export default TopBar;
