import {Observable} from 'rxjs/Rx'
import {makeAureliaDriver, ViewSource} from 'aurelia-cycle'

export class Counter {
  // cycleDrivers = { CounterView: makeAureliaDriver(this) }
  
  cycle({ CounterView }:{ CounterView: ViewSource }) {
    const action$ = Observable.merge<number, number>(
      CounterView.actions('increment').map(ev => 1),
      CounterView.actions('decrement').map(ev => -1)
    )

    const count$ = action$
      .startWith(0)
      .scan<number>((total, change) => total + change)

    const sinks = {
      CounterView: count$.map((count) => ({ 
        count: count
      }))
    }
    
    return sinks
  }
}
