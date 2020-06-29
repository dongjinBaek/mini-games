import React, {Component} from 'react';
import Cell from './Cell';

class Board extends Component {
    static defaultProps = {
        checkHighScore: () => console.warn('checkHighScore not defined')
    }

    state = {
        timeInMs: 0,
        board: Array(4).fill(Array(4).fill({number: 0, isDraggable: false})),
        pressX: 0,
        pressY: 0,
        pressedNumber: 0
    }

    onDragStart = (e, number) => {
        this.setState({
            pressX: e.pageX,
            pressY: e.pageY,
            pressedNumber: number
        });
    }
    findIndex(number, board) {
        for (let i=0; i<4; i++) {
            for (let j=0; j<4; j++) {
                if (board[i][j].number === number) {
                    return {xIdx: j, yIdx:i};
                }
            }
        }
        return {xIdx:-1, yIdx:-1};
    }
    onDragOver = (e) => {
        e.preventDefault();
    }
    onDrop = (e) => {
        const {board, pressX, pressY, pressedNumber} = this.state;
        let {xIdx, yIdx} = this.findIndex(pressedNumber, board);
        if (pressedNumber > 0) {
            let deltaX = e.pageX - pressX;
            let deltaY = e.pageY - pressY;
            let deltaXIdx = 0, deltaYIdx = 0;
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 30)        deltaXIdx = 1;
                else if (deltaX < -30)  deltaXIdx = -1;
            } else {
                if (deltaY > 30)        deltaYIdx = 1;
                else if (deltaY < -30)  deltaYIdx = -1;
            }

            if (deltaXIdx === 0 && deltaYIdx === 0) {
                this.setState({
                    pressX: 0,
                    pressY: 0,
                    pressedNumber: 0
                });
                return;
            }

            xIdx += deltaXIdx;
            yIdx += deltaYIdx;
            if (0 <= xIdx && xIdx < 4 && 0 <= yIdx && yIdx < 4) {
                let number = board[yIdx][xIdx].number;
                let boardNumberChanged = board.map(
                                            row => row.map(
                                                cell => cell.number === number        ? {...cell, number: pressedNumber} :
                                                        cell.number === pressedNumber ? {...cell, number: number} :
                                                        cell
                                            )
                                        );
                let idx = this.findIndex(0, boardNumberChanged);
                let dx = [1, -1, 0, 0], dy = [0, 0, 1, -1];
                for (let i = 0; i < 4; i++) {
                    let x = idx.xIdx + dx[i];
                    let y = idx.yIdx + dy[i];
                    if (0 <= x && x < 4 && 0 <= y && y < 4) {
                        boardNumberChanged[y][x].isDraggable = true;
                    }
                }
                this.setState({
                    board: boardNumberChanged,
                    pressX: 0,
                    pressY: 0,
                    pressedNumber: 0
                });
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
        for (let i=0; i<16; i++) {
            arr.push([Math.random(), i]);
        }
        arr.sort();
        let boardArr = [];
        for (let y=0; y<4; y++) {
            let boardArrRow = [];
            for (let x=0; x<4; x++) {
                boardArrRow.push({number: arr[4*y+x][1], isDraggable: false});
            }
            boardArr.push(boardArrRow);
        }
        let {xIdx, yIdx} = this.findIndex(0, boardArr);
        let dx = [1, -1, 0, 0], dy = [0, 0, 1, -1];
        for (let i = 0; i < 4; i++) {
            let x = xIdx + dx[i];
            let y = yIdx + dy[i];
            if (0 <= x && x < 4 && 0 <= y && y < 4) {
                boardArr[y][x].isDraggable = true;
            }
        }
        this.setState({board: boardArr});
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
        const {timeInMs, board} = this.state;
        let rows = [];
        for (let y=0; y<4; ++y) {
            let cells = [];
            for (let x=0; x<4; ++x) {
                cells.push(<td key={'td-'+y+'-'+x}>
                            <Cell
                                number={board[y][x].number}
                                isDraggable={board[y][x].isDraggable}
                                onDragStart={this.onDragStart}
                                />
                            </td>
                );
            }
            rows.push(<tr key={'tr-'+y}>{cells}</tr>)
        }
        return(
            <div className='BoardBackground' onDragOver={this.onDragOver} onDrop={this.onDrop}>
                <div className='InfoContainer'>
                    <span className='Box NewGameBtn' onClick={this.startNewGame}>New Game</span>
                    <span className='Box'>
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