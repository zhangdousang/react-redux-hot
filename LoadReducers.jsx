import {createStore,applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

export default function LoadReducers(rootReducer) {
    const loggerMiddleware = createLogger();
    const CreateMiddleware = applyMiddleware(thunkMiddleware, loggerMiddleware)(createStore);
    const store = CreateMiddleware(rootReducer);
    return store;
}