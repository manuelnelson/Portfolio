import moment, { Moment } from 'moment'

export const FormatDate = (date:string) => {
  return moment(date).format('MMM Do, YYYY');
}

export const SecondsToHours = (seconds:number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${ToTwoDecimalPlaces(hours)}:${ToTwoDecimalPlaces(minutes)}`;
}

function ToTwoDecimalPlaces(number:number){
  return number > 9 ? number : ('0' + number)
}

export const IsTodaysDate = (dateToCompare:string) => {
  const dateObj = new Date(dateToCompare)
  return IsDate(dateObj) ? dateObj.setHours(0,0,0,0) === new Date().setHours(0,0,0,0) : false;
}
export const IsBeforeTodaysDate = (dateToCompare:string) => {
  if(!dateToCompare) return false;
  const dateObj = new Date(dateToCompare)
  return IsDate(dateObj) ? dateObj.getMilliseconds() < new Date().setHours(0,0,0,0) : false;
}

export const SetDateWithTimezone = (dateString:string) => {
  let dateObj = new Date(dateString);
  if(IsDate(dateObj)) {
    dateObj.setMinutes(dateObj.getTimezoneOffset());
    return dateObj;  
  }
  return null;
}
export const weekOfMonth = (input = moment()) => {
  return Math.ceil(input.date() / 7);
}
export const createGrid = (navDate:moment.Moment,) => {
  let gridArr = [];
  const firstDayDate = moment(navDate).startOf('month');
  const initialEmptyCells = firstDayDate.weekday();
  const lastDayDate = moment(navDate).endOf('month');
  const lastEmptyCells = 6 - lastDayDate.weekday();
  const daysInMonth = navDate.daysInMonth();
  const arrayLength = initialEmptyCells + lastEmptyCells + daysInMonth;
  gridArr = new Array(arrayLength).fill(null).map((x:any, ndx:number) => {
    if(ndx < initialEmptyCells || ndx > initialEmptyCells + daysInMonth -1) {
      return {
        ndx: ndx,
        value:0,
        date: undefined,
        available: false
      }
    } 
    else {
      return {
        ndx: ndx,
        date: firstDayDate.clone().add(ndx - initialEmptyCells,'days'),
        value: ndx - initialEmptyCells + 1,
        available: true
      }
    }
  });
  return gridArr;
}
export const IsDate = (dateToTest: any) => {
  return Object.prototype.toString.call(dateToTest) === '[object Date]';
}