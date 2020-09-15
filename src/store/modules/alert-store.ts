import { Alert, AlertType } from '../entities/alert';
import {reactive} from 'vue'
import { IStore } from '..';

class AlertStore implements IStore{
  state = reactive({
    alerts: [] as Alert[],
    counter: 0 as number
  })
  
  addAlert(alert: Alert) {
    alert.id = this.state.counter;
    //check to make sure we are not adding the same alert twice, which can happen from time to time.
    if(this.state.alerts.some(x => x.message == alert.message))
      return;
    this.state.alerts.push(alert);
    this.state.counter++;
    if(!alert.disableTimeout) {
      let that = this;
      setTimeout(()=> {
        that.state.alerts = that.state.alerts.filter(x => x.id != alert.id);
        that.state.counter--
      }, 5000)  
    }
  }
  
  addSimpleAlert(message:string) {
    let alert = new Alert({
      id: 0,
      message: message,
      type: AlertType.Info
    });
    alert.id = this.state.counter;
    this.state.alerts.push(alert);
    this.state.counter++;
    let that = this;
    setTimeout(()=> {
      that.state.alerts = that.state.alerts.filter(x => x.id != alert.id);
      this.state.counter--
    }, 5000)
  }
  
  addUnauthorizedAlert() {
    const alert = new Alert({
      id: 0,
      message: 'You are not authorized to view that page',
      type: AlertType.Error
    })
    this.addAlert(alert)
  }

  removeAlert(alert: Alert) {
    this.state.alerts = this.state.alerts.filter(x=>x.id !== alert.id);
  }


  clearAlerts() {
    this.state.alerts = []
  }

}

const alertStore = new AlertStore();

export default alertStore;