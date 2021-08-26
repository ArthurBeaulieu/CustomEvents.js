import CustomEvents from '../src/CustomEvents.js';
// Create custom event singleton
const MyAppEvents = new CustomEvents(true);
/* Custom events */
// Demo utils
const subOnceButton = document.getElementById('subOnce');
const subButton = document.getElementById('sub');
const unsubButton = document.getElementById('unsub');
const pubButton = document.getElementById('pub');
// Init unsubscribe button to disable
unsubButton.disabled = true;
let myEventId = -1;
subOnceButton.addEventListener('click', () => {
  // One shot subscription example
  subOnceButton.disabled = true;
  MyAppEvents.subscribe('MyEvent', cbData => {
    console.log('Caller one shot received data', cbData);
    subOnceButton.disabled = false;
  }, true);
});
subButton.addEventListener('click', () => {
  // Subscription example
  subButton.disabled = true;
  unsubButton.disabled = false;
  myEventId = MyAppEvents.subscribe('MyEvent', cbData => {
    console.log('Caller received data', cbData);
  });
});
unsubButton.addEventListener('click', () => {
  // Unsubscription example (must provide a subscription id)
  subButton.disabled = false;
  unsubButton.disabled = true;
  MyAppEvents.unsubscribe(myEventId);
}, false);
pubButton.addEventListener('click', () => {
  // Publish event with data
  MyAppEvents.publish('MyEvent', {
    data: 'MyEventData'
  });
}, false);
/* Event listener overlay */
// Demo utils
const fireEvt = document.getElementById('fireevt');
const addEvt = document.getElementById('addevt');
const rmEvt = document.getElementById('rmevt');
// Init remove event button to disable
rmEvt.disabled = true;
// Callback to call when click event is fired
const cb = event => {
  console.log('Click callback fired', event);
};
let evtId = null;
addEvt.addEventListener('click', () => {
  evtId = MyAppEvents.addEvent('click', fireEvt, cb, this);
  rmEvt.disabled = false;
  addEvt.disabled = true;
});
rmEvt.addEventListener('click', () => {
  addEvt.disabled = false;
  rmEvt.disabled = true;
  MyAppEvents.removeEvent(evtId);
});
/* Destroy CustomEvents handler */
const destroy = document.getElementById('destroy');
destroy.addEventListener('click', () => {
  MyAppEvents.destroy();
});
