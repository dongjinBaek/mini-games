import React, {Component} from 'react';
import Cell from './Cell';
import './Board.css';

class Board extends Component {
    static defaultProps = {
        updateHighScore: () => console.warn('updateHighScore not defined')
    }

    state = {
        timeInMs: 0,
        currentNumber: 1,
        board: Array(5).fill(Array(5).fill({number: 0, flipped: false}))
    }
    onCellClick = (number) => {
        const {timeInMs, currentNumber, board} = this.state;
        if (number === currentNumber) {
            this.setState({
                currentNumber: currentNumber+1,
                board: board.map(
                            row => row.map(
                                cell => cell.number === number ? {number: number, flipped: true} : cell
                            )
                        )
            });
            if (number === 25) {
                this.stopTimer();
                alert('finished: your record is ' + timeInMs/1000 + 's');
                this.props.updateHighScore(timeInMs/1000, 'tapNumbers');
            }
        }
    }
    startTimer = () => {
        this.interval = setInterval(() => {
            const {timeInMs} = this.state;
            this.setState({timeInMs: timeInMs+100})
        }, 100);
        this.setState({timeInMs: 0})
    }
    stopTimer = () => {
        clearInterval(this.interval);
    }
    resetNumbers = () => {
        let arr = [];
        for (let i=1; i<=25; i++) {
            arr.push([Math.random(), i]);
        }
        arr.sort();
        let boardArr = [];
        for (let y=0; y<5; y++) {
            let boardArrRow = [];
            for (let x=0; x<5; x++) {
                boardArrRow.push({number: arr[5*y+x][1], flipped: false});
            }
            boardArr.push(boardArrRow);
        }
        this.setState({currentNumber: 1, board: boardArr});
    }
    startNewGame = () => {
        this.stopTimer();
        this.resetNumbers();
        this.startTimer();
    }

    componentDidMount() {
        this.resetNumbers();
        this.startTimer();
    }

    componentWillUnmount() {
        this.stopTimer();
    }
    render() {
        const {timeInMs, currentNumber, board} = this.state;
        let rows = [];
        for (let y=0; y<5; ++y) {
            let cells = [];
            for (let x=0; x<5; ++x) {
                cells.push(<td key={'td-'+y+'-'+x}>
                            <Cell
                                number={board[y][x].number}
                                flipped={board[y][x].flipped}
                                onCellClick={this.onCellClick}/>
                            </td>
                );
            }
            rows.push(<tr key={'tr-'+y}>{cells}</tr>)
        }
        return(
            <div className='BoardBackground'>
                <div className='InfoContainer'>
                    <span className='Box NewGameBtn' onClick={this.startNewGame}>New Game</span>
                    <span className='Box'>
                        <span>{currentNumber <= 25 ? 'Click ' + currentNumber : 'Done!'}</span>
                        <span>Time : {timeInMs/1000}</span>
                    </span>
                </div>
                <div className='Board'>
                    <table>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default Board;