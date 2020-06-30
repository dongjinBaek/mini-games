import React, {Component} from 'react';

class Cell extends Component {
    static defaultProps = {
        number: 0,
        x: 0,
        y: 0,
        onCellMouseDown: () => console.warn('onCellMouseDown not defined')
    }
    handleCellMouseDown = (e) => {
        const {number, onCellMouseDown} = this.props;
        onCellMouseDown(e, number);
    }

    render() {
        const {number, x, y} = this.props;
        const style = {
            width: '50px',
            height: '50px',
            borderRadius: '3px',
            background: number === 0 ? '#ddd': 'skyblue',
            color: number === 0 ? '#ddd' : 'black',
            zIndex: number === 0 ? 0 : 1,
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'absolute',
            left: x,
            top: y,
        }
        return(
            <div style={style} onMouseDown={this.handleCellMouseDown}>
                <p>{number}</p>
            </div>
        )
    }
}

export default Cell;