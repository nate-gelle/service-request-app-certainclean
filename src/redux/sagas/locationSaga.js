import { put, takeLatest } from 'redux-saga/effects';
import { LOCATION_ACTIONS } from '../actions/locationActions';
import { fetchLocations, postLocation, removeLocation } from '../requests/locationRequests';

function* fetch(){
    try{
        const locations = yield fetchLocations();
        yield put({type: LOCATION_ACTIONS.STORE, payload: locations});
    }catch(error){
        alert("Failed to get locations");
    }
}

function* post(action){
    try{
        yield postLocation(action.payload);
        yield put({type: LOCATION_ACTIONS.FETCH});
    }catch(error){
        alert("Failed to post location");
    }
}

function* remove(action){
    try{
        yield removeLocation(action.payload);
        yield put({type: LOCATION_ACTIONS.FETCH});
    }catch(error){
        alert('Failed to remove location');
    }
}

function* locationSaga(){
    yield takeLatest(LOCATION_ACTIONS.FETCH, fetch);
    yield takeLatest(LOCATION_ACTIONS.POST, post);
    yield takeLatest(LOCATION_ACTIONS.REMOVE, remove);
}

export default locationSaga;