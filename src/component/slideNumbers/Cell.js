import React, {Component} from 'react';

class Cell extends Component {
    static defaultProps = {
        number: 0,
        isDraggable: false,
        onDragStart: () => console.warn('onDragStart not defined')
    }
    handleDragStart = (e) => {
        const {number, onDragStart} = this.props;
        onDragStart(e, number);
    }

    render() {
        const {number, isDraggable} = this.props;
        const style = {
            width: '50px',
            height: '50px',
            borderRadius: '3px',
            background: number === 0 ? 'royalblue': 'skyblue',
            color: number === 0 ? 'royalblue' : 'black',
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
        }
        return(
            <div style={style} onDragStart={this.handleDragStart} draggable={isDraggable ? 'true' : 'false'}>
                <p>{number}</p>
            </div>
        )
    }
}

export default Cell;