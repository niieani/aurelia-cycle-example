import {Observable} from 'rxjs/Rx'
import {makeAureliaDriver, ViewSource, changable as c, isolateProperties as i} from './cycle/index' //from 'aurelia-cycle'


export class Todos {
  // cycleDrivers = { TodosView: makeAureliaDriver(this) }
  
  todos = c([])
  currentFilter = c('all')
  newTodoTitle = c('')
  
  cycle({ TodosView }:{ TodosView: ViewSource }) {
    const addNewTodoActions$ = TodosView.actions('addNewTodo')
      // .do(todoChange => console.log('todo change add trigger', todoChange))
    
    const newTodoTitleChanges$ = TodosView.values('newTodoTitle')
      .filter(value => value != '')
      // .do(todoChange => console.log('todo title add change trigger', todoChange))
    
    const newTodo$ = addNewTodoActions$.withLatestFrom(
      newTodoTitleChanges$, 
      (action, title) => ({ action: 'added', todo: i({ title: title, completed: false }) })
    )
    //.do(todoChange => console.log('todo change add', todoChange))
    
    //.filter(todoAction => todoAction.todo.title != '')
    
    // reset title after adding
    const newTodoTitle$ = TodosView.values('newTodoTitle')
      // .sample(newTodo$) // only update when 
      .merge(newTodo$.map(todo => ''))
      .startWith('')
    
    const removedTodo$ = TodosView.actions('destroyTodo')
      .map(action => ({ action: 'removed', todo: action.originArguments[0] }))
      // .do(todoChange => console.log('todo change remove', todoChange))
      // .do((removed) => console.log('removed', removed))
    
    type ITodo = { title: Observable<any>, completed: Observable<any> }
    
    const todoChanges$ = Observable
      .merge<any, any>(newTodo$, removedTodo$)
      .startWith(
        { action: 'added', todo: i({ title: 'one two', completed: false }) },
        { action: 'added', todo: i({ title: 'three four', completed: true }) }
      ) as Observable<{ action:string, todo:ITodo }>
    
    // todoChanges$.map(change => change.)
    // const todoChanges$ = AureliaCycle.
    // external({ title: 'abc' })
    
    const todos$ = todoChanges$
      .scan<Array<ITodo>>((array, change) => {
        if (change.action == 'added') {
          array.push(change.todo)
        }
        else {
          array.splice(array.indexOf(change.todo), 1)
        }
        return array
      }, [])
    
    const currentFilter$ = TodosView.actions('filter')
      .map(action => action.arguments[0])
      .startWith('all')
      .distinctUntilChanged().do(change => console.log('filter change', change))
    
    /*
    // I need to be notified on any change of any completed observable
    // and need to know the parent object that complete belongs to
    // so my observable needs to be triggered when any of todo.completed changes
    // merge(todo.completed, todo.completed, ...)
    // and it's value needs to be the todo object
    const todoCompletionChanges$ = todos$.map(todosArray => {
      const observables = todosArray.map(todo => todo.completed.map(completed => ({ todo, completed })))
      return Observable.merge(...observables)
    }).mergeAll()//.do(completionChange => console.log('completion change', completionChange))
    //
    const todoVisibilityChanges$ = Observable.combineLatest(todoCompletionChanges$, currentFilter$, 
      (completionChanges, filter) => {
        switch(filter) {
          case 'all': 
            return { visible: true, todo: completionChanges.todo }
          case 'active':
            return { visible: !completionChanges.completed, todo: completionChanges.todo } //!completionChanges.completed ? completionChanges.todo : null
          case 'completed':
            return { visible: completionChanges.completed, todo: completionChanges.todo }
        }
      }
    )
    
    //.do(visibilityChange => console.log('visibility change', visibilityChange))
    // todos$.
    // const visibleTodos$ = 
    // todoVisibilityChanges$
    //   .scan<Array<ITodo>>((array, change) => {
    //     if (change.visible) {
    //       array.push(change.todo)
    //     }
    //     else {
    //       array.splice(array.indexOf(change.todo), 1)
    //     }
    //     return array
    //   }, [])
    
    // const filteredTodos$ = todoCompletionChanges$.
    
    // const bindableTodos$ = todos$
    //   .map(todosArray => {
    //     return todosArray.map(todo => {
    //       const bindableObject = {}
    //       Object.getOwnPropertyNames(todo).forEach(
    //         property => bindableObject[property] = c(todo[property])
    //       )
    //       console.log('bindable todo', bindableObject, todo)
    //       return bindableObject
    //     })
    //   })
    */
    return {
      TodosView: Observable.combineLatest(
        todos$, newTodoTitle$, currentFilter$, //todoVisibilityChanges$,
        (todos, newTodoTitle, currentFilter, visibility) => ({
          todos,
          newTodoTitle,
          currentFilter,
          // visibility
        })
      )
    }
  }
}

export class FilterTodoValueConverter {
  toView(todos: Array<any>, currentFilter) {
    switch (currentFilter) {
      case 'active':
        return todos.filter(todo => !todo.completed._cycleShared.last)
      case 'completed':
        return todos.filter(todo => todo.completed._cycleShared.last)
      default:
        return todos
    }
  }
}
