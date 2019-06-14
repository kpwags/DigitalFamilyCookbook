import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Window = styled.div`
    display: none;
    background: #ffffff;
    position: absolute;
    top: 100px;
    left: 50%;
    width: 400px;
    margin-left: -200px;
    z-index: 10;
    border-radius: 4px;
    box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.05);

    form {
        box-shadow: none;
        background: #ffffff;
    }

    .close-button {
        text-align: right;
        width: 100%;
        overflow: hidden;

        button {
            border: none;
            background: #ffffff;
            display: block;
            padding: 5px 10px 0 0;
            font-size: 18px;
            color: #777888;
            float: right;
        }

        button:hover {
            color: #333333;
            cursor: pointer;
        }
    }
`;

class ModalWindow extends Component {
    static propTypes = {
        id: PropTypes.string,
        width: PropTypes.string,
        height: PropTypes.string,
        children: PropTypes.node
    };

    static closePopup(e, id) {
        e.preventDefault();
        document.getElementById(id).style.display = 'none';
        document.getElementById('page-overlay').style.display = 'none';
    }

    render() {
        const { id, width = 500, height = 300 } = this.props;
        const marginLeftVal = `${(width / 2) * -1}px`;

        const popupStyle = {
            margin: `0 0 0 ${marginLeftVal}`,
            height: `${height}px`,
            width: `${width}px`
        };

        return (
            <>
                <Window id={id} style={popupStyle}>
                    <div className="close-button">
                        <button
                            type="button"
                            onClick={e => {
                                ModalWindow.closePopup(e, id);
                            }}
                        >
                            <i className="fas fa-times" />
                        </button>
                    </div>
                    <div className="content">{this.props.children}</div>
                </Window>
            </>
        );
    }
}

export { ModalWindow };
