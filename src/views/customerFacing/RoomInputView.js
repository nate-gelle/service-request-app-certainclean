import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Rating from 'react-rating';
import { CUSTOMER_ACTIONS } from '../../redux/actions/customerActions';
//Components
import RoomComponent from '../../components/RoomComponent/RoomComponent';
import Stepper from '../../components/Stepper/Stepper';

import { ROOM_ACTIONS } from '../../redux/actions/roomActions';

// //Material UI
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const mapStateToProps = (state) => ({
  rooms: state.rooms.roomOptions,
  selectedRooms: state.customer.rooms
});

const styles = (theme) => ({
	paper: {
		position: 'absolute',
		width: theme.spacing.unit * 50,
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing.unit * 6,
		borderRadius: '200px'
	},
	card: {
		minWidth: 275
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)'
	},
	title: {
    margin: '30px',
		marginBottom: 16,
		fontSize: 10
  },
  subheading: {
    fontSize: 6
  },
	pos: {
		marginBottom: 12
	},
	iconModal: {
		float: 'right',
		height: '30px',
		margin: '3px',
		marginTop: '30px'
	},
	circlesModal: {
		float: 'right',
		marginRight: '5px',
		paddingBottom: '10px'
  },
  roomDropDown: {
    marginTop: '30px',
  }
});

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`
	};
}

class RoomInputView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			room: {
				room_id: '',
				room_name: '',
				cleanliness_score: 3
			},
			roomName: ''
		};
	}

	handleOpen = () => {
		this.setState({ open: true });
	};

	handleClose = () => {
		this.setState({ open: false });
	};

	componentDidMount() {
    this.props.dispatch({ type: ROOM_ACTIONS.FETCH });
	} // end componentDidMount


	handleChange = (event) => {
   		this.setState({room: {...this.state.room, room_id: event.target.value.id, room_name: event.target.value.room_name}, roomName: event.target.value.room_name });
	}; // end handle change

	setScore = (rate) => {
		this.setState({room: {...this.state.room, cleanliness_score: rate}});
	}

	addRoomToReducer = () => {
		this.props.dispatch({type: CUSTOMER_ACTIONS.ROOMS, payload: this.state.room});
		this.handleClose();
		this.clearState();
	}

	clearState = () => {
		this.setState({room: {room_id: '', room_name: '', cleanliness_score: 3}, roomName: ''});
	}

	render() {
		let content = null;
		const { classes } = this.props;		 
			content = (
				<center>
					<Stepper activeStep={0}/>
					<RoomComponent />
					<div>
						<Typography gutterBottom>Click to add room!</Typography>
						<Button onClick={this.handleOpen}>Add room</Button>
						<Modal
							aria-labelledby="simple-modal-title"
							aria-describedby="simple-modal-description"
							open={this.state.open}
							onClose={this.handleClose}
						>
							<div style={getModalStyle()} className={classes.paper}>
								<Typography variant="title" id="modal-title">
									Add kind of room and how dirty it is.
								</Typography>
								<Typography variant="subheading" id="simple-modal-description">
									To prevent misestiamting please, input real information.
								</Typography>

                  <FormControl className={classes.formControl}>
          <Select
            onChange={this.handleChange}
            className={classes.roomDropDown}
            value={this.state.roomName}
          >
            <MenuItem value={this.state.roomName} disabled>
              {this.state.roomName}
            </MenuItem>
          {this.props.rooms.map(room =>
                        <MenuItem key={room.id} value={room}>{room.room_name}</MenuItem>
                    )};
          </Select>
          <FormHelperText>Select room that needs to be cleaned</FormHelperText>
        </FormControl>

								<Rating
									className={classes.circlesModal}
									onChange={(rate) => this.setScore(rate)}
									initialRating={this.state.room.cleanliness_score}
									placeholderRating={3.0}
									emptySymbol={<img src="/RatingIconGrey.png" className={classes.iconModal} />}
									placeholderSymbol={<img src="/RatingIconOrange.png" className={classes.iconModal} />}
									fullSymbol={<img src="/RatingIconOrange.png" className={classes.iconModal} />}
								/>
                <center><Button onClick={this.addRoomToReducer}>Add room</Button><Button onClick={this.handleClose}>Close</Button></center>
							</div>
						</Modal>
					</div>
					<div>
						<Button onClick={() => this.props.history.push('schedule')}>
							Next
						</Button>
					</div>
				</center>
			);
		

		return <div>{content}</div>;
	}
}

RoomInputView.propTypes = {
	classes: PropTypes.object.isRequired
};

export default compose(withStyles(styles), connect(mapStateToProps))(RoomInputView);
