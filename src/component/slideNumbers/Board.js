import React, {Component} from 'react';
import Cell from './Cell';
import './Board.css';

class Board extends Component {
    static defaultProps = {
        updateHighScore: () => console.warn('updateHighScore not defined')
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
    setDraggableValues(board) {
        let dx=[1,-1,0,0], dy=[0,0,1,-1];
        for (let y=0; y<3; y++) {
            for (let x=0; x<3; x++) {
                board[y][x].draggableX = 0;
                board[y][x].draggableY = 0;
                for (let i=0; i<4; i++) {
                    let Y=y+dy[i], X=x+dx[i];
                    if (0 <= X && X < 3 && 0 <= Y && Y < 3) {
                        if (board[Y][X].number === 0) {
                            board[y][x].draggableX = dx[i];
                            board[y][x].draggableY = dy[i];
                            break;
                        }
                    }
                }
            }
        }
    }
    checkGameFinished(board) {
        for (let y=0; y<3; y++) {
            for (let x=0; x<3; x++) {
                if (y === 2 && x === 2) {
                    return true;
                } else if (board[y][x].number !== 3*y+x+1) {
                    return false;
                }
            }
        }
        return false;
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
                                                        dx: (deltaX * cell.draggableX > 0 ? (Math.abs(deltaX) > 54 ? 54 * cell.draggableX : deltaX) : 0),
                                                        dy: (deltaY * cell.draggableY > 0 ? (Math.abs(deltaY) > 54 ? 54 * cell.draggableY : deltaY) : 0)
                                                    } : cell
                    )
                )
            });
        }
    }
    onMouseUp = (e) => {
        const {timeInMs, pressX, pressY, pressedNumber, board} = this.state;
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

            if (deltaX * pressedCell.draggableX + deltaY * pressedCell.draggableY > 30) {
                let newBoard = board.map(
                    row => row.map(
                        cell => cell === zeroCell ? {...cell, number: pressedNumber} :
                                cell === pressedCell ? {...cell, number: 0, dx:0, dy:0} :
                                cell
                    )
                );
                this.setDraggableValues(newBoard);
                if(this.checkGameFinished(newBoard)) {
                    this.stopTimer();
                    alert('finished: your record is ' + timeInMs/1000 + 's');
                    this.props.updateHighScore(timeInMs/1000, 'slideNumbers');
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
        let newBoard = [];
        for (let y=0; y<3; y++) {
            let newBoardRow = []
            for (let x=0; x<3; x++) {
                newBoardRow.push({number: x === 2 && y === 2 ? 0 : 3*y+x+1, draggableX: 0, draggableY: 0, x0: (x-1)*50-25, y0: y*50, dx: 0, dy: 0});
            }
            newBoard.push(newBoardRow);
        }
        let xIdx=2, yIdx=2;
        let dx = [1, -1, 0, 0], dy = [0, 0, 1, -1];
        for (let i = 0; i < 1000; i++) {
            let idx = Math.floor(Math.random() * 4);
            let x = xIdx + dx[idx];
            let y = yIdx + dy[idx];
            if (0 <= x && x < 3 && 0 <= y && y < 3) {
                newBoard[yIdx][xIdx].number = newBoard[y][x].number;
                newBoard[y][x].number = 0;
                xIdx = x;
                yIdx = y;
            }
        }
        
        this.setDraggableValues(newBoard);
        this.setState({board: newBoard});
    }

    startNewGame = () => {
        this.stopTimer();
        this.resetNumbers();
        this.startTimer();
    }

    componentDidMount() {
        this.resetNumbers();
        this.startTimer();
        document.body.addEventListener('mousemove', this.onMouseMove);
        document.body.addEventListener('mouseup', this.onMouseUp);
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
            <div className='BoardBackground'>
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