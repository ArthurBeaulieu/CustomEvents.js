# CustomEvents.js

![](https://badgen.net/badge/version/1.2.0/blue)
[![License](https://img.shields.io/github/license/ArthurBeaulieu/CustomEvents.js.svg)](https://github.com/ArthurBeaulieu/CustomEvents.js/blob/master/LICENSE.md)
![](https://badgen.net/badge/documentation/written/green)
![](https://badgen.net/badge/test/passed/green)
![](https://badgen.net/badge/dependencies/none/green)

`CustomEvents.js` is a JavaScript ES6 component that offers a general event handler ; an abstraction of `addEventListener` and `removeEventListener` methods helps you easily manage your events, without bothering with usual binding issues that come along properly removing events. There is also an internal event system that allow you to define a custom event, and register as many subscriptions as you need to be called when you publish your custom event.

With ~6Ko minified, `CustomEvents.js` is designed to be stable and remain as light as possible. It is meant to be used application wide (events that are global to all your components) or to be used in classes, so it easily manages all the class events (creation and destruction).

# Get Started

This repository was made to store documentation, test bench and source code. If you want to include this component in your project, you either need the `src/CustomEvents.js` file if you have an assets bundler in your project, or use the `dist/CustomEvents.min.js` to use the minified component. This minified file is compiled in ES5 JavaScript for compatibility reasons. The unminified file is, in the contrary, coded in ES6 JavaScript.

Here's an example on how to create a custom event handler :
```javascript
/* Import the Js component */
import CustomEvents from 'src/CustomEvents.js';
/* Create an event handler */
const myEventHandler = new CustomEvents();
/* ...Or, if you want to have a verbose console output */
const myEventHandler = new CustomEvents(true);
```

When instantiated, your event handler is ready to register events (both JavaScript and custom ones).

## Regular event listeners

When you need to `addEventListener` on an element, you instead may call the `addEvent` method that is alike :

```javascript
const testDiv = document.createElement('DIV');
// Define a click event on testDiv
myEventHandler.addEvent('click', testDiv, () => {
  console.log('My callback that is fired when click event is triggered on testDiv');
});
```

When done, you can remove this event listener by using its ID, as follows :

```javascript
// addEvent return the event unique ID, to use when manually removing the event
const evtId = myEventHandler.addEvent('click', testDiv, () => {});
// Remove an event listener with its event ID
myEventHandler.removeEvent(evtId);
```

You can also set the scope of the callback, or define the capture state of the event by adding extra argument to `addEvent` call :

```javascript
const cbScope = document.createElement('CANVAS')
// Define an event that binds the cbScope DOM object to the event callback and uses capture
myEventHandler.addEvent('click', testDiv, function() {
  console.log('This is cbScope !');
}, cbScope, true);
```

Finally, if you want to manually clear all registered event listeners :

```javascript
// This will remove all saved event listeners
myEventHandler.removeAllEvents();
// ...Or, calling destroy will also unregister saved event listeners, among destroying handler
myEventHandler.destroy();
```

## Custom events

In order to define events that are not based on a DOM interaction (aka related to a DOM element), you can use the subscribe/publish mechanism.

For a given event, you can make a subscription that will be called each time the event is published. Here is an example on how it works :

```javascript
// Create a subscription for ExampleEvent and log when called
myEventHandler.subscribe('ExampleEvent', () => {
  console.log('ExampleEvent fired !');
});
// Publish an ExampleEvent custom event
myEventHandler.publish('ExampleEvent');
```

The publish method also allow to send data through the event :

```javascript
// Create a subscription for ExampleEvent and log when called
myEventHandler.subscribe('ExampleEvent', data => {
  console.log(data); // Will output 'My data is a string'
});
// Publish an ExampleEvent custom event
myEventHandler.publish('ExampleEvent', 'My data is a string');
```

When done you can use the unsubscribe method as follows :

```javascript
const customEventId = myEventHandler.subscribe('ExampleEvent', () => {});
// Remove a subscription from its unique ID
myEventHandler.unsubscribe(customEventId);
```

Finally, if you want to clear all registered subscriptions for a custom event ;

```javascript
// This will remove all saved subscriptions for custom event
myEventHandler.unsubscribeAllFor('ExampleEvent');
// ...Or, calling destroy will also unregister saved subscriptions, among destroying handler
myEventHandler.destroy();
```

You're now good to go! If however you need more information, you can read the online [documentation](https://arthurbeaulieu.github.io/CustomEvents.js/doc/).

# Development

If you clone this repository, you can `npm install` to install development dependencies. This will allow you to build dist file, run the component tests or generate the documentation ;

- `npm run build` to generate the minified file ;
- `npm run dev` to watch for any change in source code ;
- `npm run web-server` to launch a local development server ;
- `npm run doc` to generate documentation ;
- `npm run test` to perform all tests at once ;
- `npm run testdev` to keep browsers open to debug tests ;
- `npm run beforecommit` to perform tests, generate doc and bundle the JavaScript.

To avoid CORS when locally loading the example HTML file, run the web server. Please do not use it on a production environment. Unit tests are performed on both Firefox and Chrome ; ensure you have both installed before running tests, otherwise they might fail.

If you have any question or idea, feel free to DM or open an issue (or even a PR, who knows) ! I'll be glad to answer your request.
