import React, {Component} from 'react';
import Cell from './Cell';
import './Board.css';

class Board extends Component {
    static defaultProps = {
        checkHighScore: () => console.warn('checkHighScore not defined')
    }

    state = {
        timeInMs: 0,
        board: Array(3).fill(Array(3).fill({number: 0, draggableX: 0, draggableY: 0, x0: 0, y0: 0, dx: 0, dy: 0})),
        pressX: undefined,
        pressY: undefined,
        pressedNumber: undefined
    }

    onCellMouseDown = (e, number) => {
        this.setState({
            pressX: e.pageX,
            pressY: e.pageY,
            pressedNumber: number
        });
    }

    findIndex(number, board) {
        for (let i=0; i<3; i++) {
            for (let j=0; j<3; j++) {
                if (board[i][j].number === number) {
                    return {xIdx: j, yIdx:i};
                }
            }
        }
        return {xIdx:-1, yIdx:-1};
    }
    onMouseMove = (e) => {
        const {pressX, pressY, pressedNumber, board} = this.state;
        const deltaX = e.pageX - pressX;
        const deltaY = e.pageY - pressY;
        if (pressedNumber !== undefined) {
            this.setState({
                board: board.map(
                    row => row.map(
                        cell => cell.number === pressedNumber ? 
                                                    {...cell, 
                                                        dx: (deltaX * cell.draggableX > 0 ? deltaX : 0),
                                                        dy: (deltaY * cell.draggableY > 0 ? deltaY : 0)
                                                    } : cell
                    )
                )
            });
        }
    }
    onMouseUp = (e) => {
        const {pressX, pressY, pressedNumber, board} = this.state;
        const deltaX = e.pageX - pressX;
        const deltaY = e.pageY - pressY;
        if (pressedNumber === undefined) {
            this.setState({
                pressX: undefined,
                pressY: undefined,
                pressedNumber: undefined
            });
        } else {
            let pressedCellIdx = this.findIndex(pressedNumber, board);
            let pressedCell = board[pressedCellIdx.yIdx][pressedCellIdx.xIdx];

            let zeroCellIdx = this.findIndex(0, board);
            let zeroCell = board[zeroCellIdx.yIdx][zeroCellIdx.xIdx];
            if (deltaX * pressedCell.draggableX > 30 || deltaY * pressedCell.draggableY > 30) {
                let newBoard = board.map(
                    row => row.map(
                        cell => cell === zeroCell ? {...cell, number: pressedNumber} :
                                cell === pressedCell ? {...cell, number: 0, dx:0, dy:0} :
                                cell
                    )
                );
                let dx=[1,-1,0,0], dy=[0,0,1,-1];
                for (let y=0; y<3; y++) {
                    for (let x=0; x<3; x++) {
                        let nextToZero = false;
                        for (let i=0; i<4; i++) {
                            let Y=y+dy[i];
                            let X=x+dx[i];
                            if (0 <= X && X < 3 && 0 <= Y && Y < 3) {
                                if (newBoard[Y][X].number === 0) {
                                    nextToZero = true;
                                    newBoard[y][x].draggableX = dx[i];
                                    newBoard[y][x].draggableY = dy[i];
                                }
                            }
                        }
                        if (!nextToZero) {
                            newBoard[y][x].draggableX = 0;
                            newBoard[y][x].draggableY = 0;
                        }
                    }
                }
                this.setState({
                    pressX: undefined,
                    pressY: undefined,
                    pressedNumber: undefined,
                    board: newBoard
                });
            } else {
                this.setState({
                    pressX: undefined,
                    pressY: undefined,
                    pressedNumber: undefined,
                    board: board.map(
                        row => row.map(
                            cell => cell === pressedCell ? {...cell, dx:0, dy:0} : cell
                        )
                    )
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
        for (let i=0; i<9; i++) {
            arr.push([Math.random(), i]);
        }
        arr.sort();
        let boardArr = [];
        for (let y=0; y<3; y++) {
            let boardArrRow = [];
            for (let x=0; x<3; x++) {
                boardArrRow.push({number: arr[3*y+x][1], draggableX: 0, draggableY: 0, x0:(x-1)*50-25, y0:y*50, dx: 0, dy: 0});
            }
            boardArr.push(boardArrRow);
        }
        let {xIdx, yIdx} = this.findIndex(0, boardArr);
        let dx = [1, -1, 0, 0], dy = [0, 0, 1, -1];
        for (let i = 0; i < 4; i++) {
            let x = xIdx + dx[i];
            let y = yIdx + dy[i];
            if (0 <= x && x < 3 && 0 <= y && y < 3) {
                boardArr[y][x].draggableX = -dx[i];
                boardArr[y][x].draggableY = -dy[i];
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
        for (let y=0; y<3; ++y) {
            let cells = [];
            for (let x=0; x<3; ++x) {
                cells.push(<td key={'td-'+y+'-'+x} className='BoardTd'>
                            <Cell
                                number={board[y][x].number}
                                onCellMouseDown={this.onCellMouseDown}
                                x={board[y][x].x0 + board[y][x].dx}
                                y={board[y][x].y0 + board[y][x].dy}
                                />
                            </td>
                );
            }
            rows.push(<tr key={'tr-'+y}>{cells}</tr>)
        }
        return(
            <div className='BoardBackground' onMouseMove={this.onMouseMove} onMouseUp={this.onMouseUp}>
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