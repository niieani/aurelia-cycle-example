import {Observable} from 'rxjs/Rx'
import {makeAureliaDriver, ViewSource} from './cycle/index'//from 'aurelia-cycle'

import {bindable} from 'aurelia-framework'

export class BindingTest {
  @bindable boundincrementaction;
  @bindable bounddecrementaction;
  @bindable twowayboundvalue;
  
  cycle({ BindingTestView }) {
    return { }
  }
}
