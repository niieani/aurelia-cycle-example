import {Observable} from 'rxjs/Rx'
import {makeAureliaDriver, ViewSource} from './cycle/index'//from 'aurelia-cycle'

import {bindable} from 'aurelia-framework'

const ENTER_KEY = 13
const ESC_KEY = 27

// let i = 0

// function aTest() {
//   console.log('from aTest')
//   let out = { 
//     val: 'some value ' + ++i
//   }
  
//   out.getObserver = function(value) {
//     return {
//       subscribe: function(context, obj) {
//         console.log('from subscription')
//         obj.call()
        
//         console.log('from subscription 2')
//         obj.call()
//       }
//     };
//   };
//   return out
// }

export class TodoItem {
  // cycleDrivers = { TodoItemView: makeAureliaDriver(this) }
  
  // public values
  @bindable title;
  @bindable completed;
  // @bindable destroyAction;
  @bindable destroy;
  // something = true;
  
  // bind() {
  //   console.log('bind item', this)
  //   // delete this.destroyAction
  // }
  
  cycle({ TodoItemView }:{ TodoItemView: ViewSource }) {
    
    const completed$ = TodoItemView.values('completed')
    // const destroy$ = TodoItemView.actions('destroy')
    //                   .map(action => true) //.startWith(false)
    
    const startEdit$ = TodoItemView.actions('startEdit')
      //.do(e => console.log(e))
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
    
    return {
      TodoItemView: Observable.combineLatest(
        editing$,
        (editing) => ({ 
          editing
        })
      )
      // TodoItemView: Observable.combineLatest(
      //   editing$, destroy$,
      //   (editing, destroy) => ({ 
      //     editing,
      //     // destroy
      //   })
      // )
    }
  }
}
