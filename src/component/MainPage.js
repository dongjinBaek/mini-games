import React from 'react';
import {Link} from 'react-router-dom';
import './MainPage.css';

const MainPage = () => {
    return (
        <div className='MainPage'>
            <ul>
                <li><Link to='/bestScores'>Best Scores</Link></li>
                <li><Link to='/game/tapNumbers'>Tap Numbers</Link></li>
                <li><Link to='/game/slideNumbers'>Slide Numbers</Link></li>
            </ul>
        </div>
    )
}

export default MainPage;