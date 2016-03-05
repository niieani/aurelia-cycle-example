import {Observable} from 'rxjs/Rx'
import {makeAureliaDriver, ViewSource} from './cycle/index' //'aurelia-cycle'

export class CounterShared {
  // cycleDrivers = { CounterView: makeAureliaDriver(this) }
  
  cycle({ CounterSharedView }:{ CounterSharedView: ViewSource }) {
    const action$ = Observable.merge<number, number>(
      CounterSharedView.actions('increment').map(ev => 1),
      CounterSharedView.actions('decrement').map(ev => -1)
    )

    const count$ = action$
      .startWith(0)
      .scan<number>((total, change) => total + change)

    const sinks = {
      CounterSharedView: count$.map((count) => ({ 
        count
      }))
    }
    
    return sinks
  }
}
