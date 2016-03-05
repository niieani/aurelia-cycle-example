import {Observable} from 'rxjs/Rx'
import {makeAureliaDriver, ViewSource, changable as c} from './cycle/index' //from 'aurelia-cycle'


export class Todos {
  // cycleDrivers = { TodosView: makeAureliaDriver(this) }
  
  cycle({ TodosView }:{ TodosView: ViewSource }) {
    const newTodo$ = TodosView.actions('addNewTodo').withLatestFrom(
      TodosView.values('newTodoTitle'), 
      (action, title) => ({ action: 'added', todo: { title: title, completed: false } })
    ).filter(todoAction => todoAction.todo.title != '')
    
    const newTodoTitle$ = TodosView.values('newTodoTitle')
      // .sample(newTodo$) // only update when 
      .merge(newTodo$.map(todo => ''))
      .startWith('')
    
    const removedTodo$ = TodosView.actions('destroyTodo')
      .map(action => ({ action: 'removed', todo: action.arguments[0] }))
      // .do((removed) => console.log('removed', removed))
      
    const todoActions$ = Observable
      .merge<any, any>(newTodo$, removedTodo$)
      .startWith(
        { action: 'added', todo: { title: 'one two', completed: false } },
        { action: 'added', todo: { title: 'three four', completed: true } }
      )
    
    // const todoChanges$ = AureliaCycle.
    // external({ title: 'abc' })
    
    const todos$ = todoActions$
      .scan<Array<any>>((array, change) => {
        if (change.action == 'added') {
          array.push(change.todo)
        }
        else {
          array.splice(array.indexOf(change.todo), 1)
        }
        return array
      }, [])
    
    // const bindableTodos$ = todos$
    //   .map(todo => Object.getOwnPropertyNames(todo).map(property => todo[property] = c(todo[property])))
    
    const currentFilter$ = TodosView.actions('filter')
      .map(action => action.arguments[0])
      .startWith('all')
    
    return {
      TodosView: Observable.combineLatest(
        todos$, newTodoTitle$, currentFilter$,
        (todos, newTodoTitle, currentFilter) => ({
          todos,
          newTodoTitle,
          currentFilter
        })
      )
    }
  }
}

export class FilterTodoValueConverter {
  toView(todos: Array<any>, currentFilter) {
    switch (currentFilter) {
      case 'active':
        return todos.filter(todo => !todo.completed)
      case 'completed':
        return todos.filter(todo => todo.completed)
      default:
        return todos
    }
  }
}
