import Calendar from 'react-big-calendar';
import moment from 'moment';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import './custom-big-calendar.css';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { compose } from 'redux';
// import { CUSTOMER_ACTIONS } from '../../redux/actions/customerActions';
import { AVAILABILITY_ACTIONS } from '../../redux/actions/availabilityActions';
import { CUSTOMER_ACTIONS } from '../../redux/actions/customerActions';
import sweetAlertFailure from '../../redux/modules/sweetAlertFailure';
import sweetAlertSuccess from '../../redux/modules/sweetAlertSuccess';

Calendar.setLocalizer(Calendar.momentLocalizer(moment));
const DragAndDropCalendar = withDragAndDrop(Calendar);

const mapStateToProps = state => ({
    available: state.availability.available,
    unavailable: state.availability.unavailable,
    estimate: state.customer.duration,
});

class ApptCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [
                {    
                start: null,
                end: null,
                },
            ],

            newEvent: {
                start: null,
                end: null,
            }
        }
    }

    componentDidMount() {
        this.props.dispatch({ type: AVAILABILITY_ACTIONS.FETCH });
        this.props.dispatch({ type: AVAILABILITY_ACTIONS.GET_UN});
    }

    componentDidUpdate(prevProps) {
        console.log('in update', prevProps);
        console.log(this.props.unavailable);
        
        if(this.props.unavailable !== prevProps.unavailable) {
            
            if (this.props.userType === 'customer'){
                console.log('in cond', this.props.unavailable);
                let tempArray = [];
                for(let object of this.props.unavailable){
                    for(let prop in object){
                        object[prop] = new Date(object[prop]);
                    }
                    tempArray.push(object);
                }  

                this.setState({events: [...this.state.events, ...tempArray]});
            }
            else if (this.props.userType === 'admin'){
                console.log("Admin");
                let tempArray = [];
                for(let object of this.props.available){
                    for(let prop in object){
                        object[prop] = new Date(object[prop]);
                    }
                    tempArray.push(object);
                }
                    this.setState({events: [...tempArray]});
                }
        }
    }

    moveEvent = ({ event, start, end }) => {
        const { events } = this.state;
        const idx = events.indexOf(event);
        if(idx === 0){
            const updatedEvent = { ...event, start, end}
        
            const nextEvents = [...events]
            nextEvents.splice(idx, 1, updatedEvent)
        
            this.setState({
            events: nextEvents,
            })
            console.log('this.state=', this.state)
            sweetAlertSuccess(`You're desired cleaning time has changed to be on ${updatedEvent.start.toLocaleDateString()} from ${updatedEvent.start.toLocaleTimeString()} to ${updatedEvent.end.toLocaleTimeString()}.`);
        } else {
            sweetAlertFailure("You can only change your event.");
        }
    }

    onSelect = (slotInfo) => {
        if (this.props.userType === 'customer'){
            console.log("ME!", slotInfo.start.getHours(), slotInfo.end.getHours());
            console.log(this.props.estimate);
            if(this.state.events[0].start){
                sweetAlertFailure("You've already chosen a time for the cleaning, if this was a mistake, feel free to drag and drop your previous selection to your desired time.");
            } else {
                    let start = new Date(slotInfo.start);
                    let end = new Date(slotInfo.end);
                    let diffHours = end.getHours() - start.getHours();
                    let diffMinutes = end.getMinutes() - start.getMinutes();
                    let diff = diffHours + (diffMinutes / 60);
                    if (this.props.estimate === diff){
                        console.log('slotInfo:', slotInfo);
                        this.setState({
                            newEvent: {start: new Date(slotInfo.start), end: new Date(slotInfo.end)},
                        });
                        this.setState({
                            events: [this.state.newEvent, ...this.props.unavailable]
                        })
                        this.dispatchAppt();
                        return true;
                    } else {
                        sweetAlertFailure(`The time you've selected does not match your estimated duration of ${this.props.estimate} hour(s). Please select another time that will accomodate this estimate.`);
                    }
            }
        } else if (this.props.userType === 'admin'){
            this.setState({
                newEvent: {start: new Date(slotInfo.start), end: new Date(slotInfo.end)},
            });
            this.setState({
                events: [...this.state.events, this.state.newEvent]
            })
            this.dispatchAvailability();
            return true;
        }        
    }    

    dispatchAppt = () => {
        this.props.dispatch({ type: CUSTOMER_ACTIONS.APPT, payload: this.state.newEvent });
        sweetAlertSuccess(`We've recorded you're desired cleaning time on ${this.state.newEvent.start.toLocaleDateString()} from ${this.state.newEvent.start.toLocaleTimeString()} to ${this.state.newEvent.end.toLocaleTimeString()}`);
    }

    dispatchAvailability = () => {
        this.props.dispatch({ type: AVAILABILITY_ACTIONS.NEW, payload: this.state.newEvent });
        this.setState({
            newEvent: { start: null, end: null }
        })
    }

    render() {
        // const { classes } = this.props;
        return (
            <div>
                <DragAndDropCalendar 
                // className={classes.calendar}
                defaultDate={new Date()}
                defaultView={Calendar.Views.WEEK}
                views={{
                    week: true,
                }}
                events={this.state.events}
                onEventResize={this.resizeEvent}
                onEventDrop={this.moveEvent}
                selectable
                resizable
                showMultiDayTimes
                step={30}
                min={new Date(2018, 7, 2, 5)}
                max={new Date(2018, 7, 2, 20)}
                onSelectSlot={this.onSelect}
                />
            </div>
        );
    }
}

// ApptCalendar.propTypes = {
//     classes: PropTypes.object.isRequired,
// };
  

export default connect(mapStateToProps)(DragDropContext(HTML5Backend)(ApptCalendar));