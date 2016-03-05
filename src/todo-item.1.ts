import {Observable} from 'rxjs/Rx'
import {makeAureliaDriver, ViewSource} from 'aurelia-cycle'

import {bindable} from 'aurelia-framework'

const ENTER_KEY = 13
const ESC_KEY = 27

export class TodoItem {
  // cycleDrivers = { TodoItemView: makeAureliaDriver(this) }
  
  // public values
  @bindable title;
  @bindable completed;
  
  cycle({ TodoItemView }:{ TodoItemView: ViewSource }) {
    
    const completed$ = TodoItemView.values('completed')
    const destroy$ = TodoItemView.actions('destroy')
    
    const startEdit$ = TodoItemView.actions('startEdit')
    const cancelEdit$ = TodoItemView.actions('keyUp')
      .filter((action) => (action.event as KeyboardEvent).keyCode === ESC_KEY)
    const doneEdit$ = TodoItemView.actions('keyUp')
      .filter((action) => (action.event as KeyboardEvent).keyCode === ENTER_KEY)
      .merge(TodoItemView.actions('doneEdit'))
      
    // THE EDITING STREAM
    // Create a stream that emits booleans that represent the
    // "is editing" state.
    const editing$ = Observable
      .merge(
        startEdit$.map(() => true),
        doneEdit$.map(() => false),
        cancelEdit$.map(() => false)
      )
      .startWith(false)
    
    const sinks = {
      TodoItemView: Observable.combineLatest(
        editing$, destroy$,
        (editing, destroy) => ({ 
          editing,
          // destroy
        })
      )
    }
    
    return sinks
  }
}
