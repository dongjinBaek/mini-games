import React, {Component} from 'react';

class Cell extends Component {
    static defaultProps = {
        number: 0,
        flipped: false,
        onCellClick: () => console.warn('onCellClick not defined')
    }
    handleCellClick= (e) => {
        const {number, onCellClick} = this.props;
        onCellClick(number);
    }
    render() {
        const style = {
            width: '50px',
            height: '50px',
            borderRadius: '3px',
            background: this.props.flipped ? 'royalblue': 'skyblue',
            color: this.props.flipped ? 'royalblue' : 'black',
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
        }
        return(
            <div style={style} onClick={this.handleCellClick}>
                <p>{this.props.number}</p>
            </div>
        )
    }
}

export default Cell;