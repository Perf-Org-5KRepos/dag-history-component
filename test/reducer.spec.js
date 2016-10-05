import { expect } from 'chai';
import reduceFactory from '../src/reducer';

const reducer = () => reduceFactory({
  actionFilter: () => false,
});

describe('The Dag-History Component Reducer', () => {
  it('is a function that returns a function', () => {
    expect(reduceFactory).to.be.a.function;
    expect(reduceFactory({})).to.be.a.function;
  });

  it('can generate an initial state', () => {
    const state = reducer()(undefined, { type: 'DERP' });
    expect(state).to.deep.equal({
      mainView: 'history',
      branchContainerExpanded: true,
    });
  });

  it('can respond to a SELECT_MAIN_VIEW action', () => {
    const state = reducer()(undefined, { type: 'SELECT_MAIN_VIEW', payload: 'abc123' });
    expect(state).to.deep.equal({
      mainView: 'abc123',
      branchContainerExpanded: true,
    });
  });

  it('can respond to a TOGGLE_BRANCH_CONTAINER action', () => {
    let state = reducer()(undefined, { type: 'TOGGLE_BRANCH_CONTAINER' });
    expect(state).to.deep.equal({
      mainView: 'history',
      branchContainerExpanded: false,
    });
    state = reducer()(state, { type: 'TOGGLE_BRANCH_CONTAINER' });
    expect(state).to.deep.equal({
      mainView: 'history',
      branchContainerExpanded: true,
    });
  });

  it('will not reset the main view to history if DAG_HISTORY_* actions are taken', () => {
    const initialState = {
      mainView: 'bookmarks',
      branchContainerExpanded: true,
    };
    const state = reducer()(initialState, { type: 'DAG_HISTORY_DERP' });
    expect(state).to.deep.equal(initialState);
  });

  it('will reset the main view to history if an insertable action occurs', () => {
    const initialState = {
      mainView: 'bookmarks',
      branchContainerExpanded: true,
    };
    const reduce = reduceFactory({
      actionFilter: () => true,
    });
    const state = reduce(initialState, { type: 'DERP' });
    expect(state.mainView).to.equal('history');
  });
});