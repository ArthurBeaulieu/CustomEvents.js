const CustomEventsVersion = '0.1';


class CustomEvents {


	constructor(options = {}) {
		// Internal debug flag for logging
		this._debug = options.debug || false;
		/* Start the ID incrementor at pseudo random value */
		this._idIncrementor = (Math.floor(Math.random() * Math.floor(256)) * 5678);
		/* We store events by name as key, each key stores an Array of subscribed events */
		this._events = {};
	}


	destroy() {
		// Remove all existing eventListener
	}


	/**  ----------  Custom events with multiple subscriptions  ----------  **/
	/**  The three following methods (subscribe, unsubscribe, publish) are  **/
	/**  designed to reference an event by its name and handle as many      **/
	/**  subscriptions as you want. When subscribin, you get an ID you can  **/
	/**  use to unsubscribe your event later. Just publish with the event   **/
	/**  name to callback all its registered subscriptions.                 **/


	/** Subscribe method allow you to listen to an event and react when it occurs.
	* @param {object} options - Event parameters
	* @param {string} eventName - Event name (the one to use to publish)
	* @param {function} callback - The callback to execute when event is published
	* @param {boolean} [oneShot] - One shot (optional, default to false) : to remove subscription the first time callback is fired
  * @returns {number} - The event id, to be used when manually unsubscribing **/
	subscribe(eventName, callback, oneShot = false) {
		// Debug logging
		if (this._debug) { console.log('Events.subscribe', eventName, callback, oneShot); }
		// Create event entry if not already existing in the registered events
		if (!this._events[eventName]) {
			this._events[eventName] = []; // Set empty array for new event subscriptions
		}
		// Push new subscription for event name
		this._events[eventName].push({
			id: this._idIncrementor,
			name: eventName,
			os: oneShot,
			callback: callback
		});
		// Post increment to return the true event entry id, then update the incrementor
		return this._idIncrementor++;
	}


	/** Unsubscribe method allow you to revoke an event subscription.
	* @param {number} eventId - The subscription id returned when subscribing to an event name
  * @returns {boolean} - The method status ; true for success, false for non-existing subscription **/
	unsubscribe(eventId) {
		// Debug logging
		if (this._debug) { console.log('Events.unsubscribe : eventId', eventId); }
		// Returned value
		let statusCode = false; // Not found status code by default (false)
		// Save event keys to iterate properly on this._events Object
		let keys = Object.keys(this._events);
		// Reverse events iteration to properly splice without messing with iteration order
		for (let i = (keys.length - 1); i >= 0; --i) {
			// Get event subscriptions
			let subs = this._events[keys[i]];
			// Iterate over events subscriptions to find the one with given id
			for (let j = 0; j < subs.length; ++j) {
				// In case we got a subscription for this events
				if (subs[j].id === eventId) {
					// Debug logging
					if (this._debug) { console.log(`Events.unsubscribe : subscription found\n`, subs[j], `\nSubscription n°${eventId} for ${subs.name} has been removed`); }
					// Update status code
					statusCode = true; // Found and unsubscribed status code (true)
					// Remove subscription from event Array
					subs.splice(j, 1);
					// Remove event name if no remaining subscriptions
					if (subs.length === 0) {
						delete this._events[keys[i]];
					}
					// Break since id are unique and no other subscription can be found after
					break;
				}
			}
		}
		// Return with status code
		return statusCode;
	}


	/** Publish method allow you to fire an event by name and trigger all its subscription by callbacks
	* @param {object} options - Event parameters
	* @param {string} eventName - Event name (the one to use to publish)
	* @param {boolean} [data] - One shot (optional, default to false) : to remove subscription the first time callback is fired
	* @returns {boolean} - The method status ; true for success, false for non-existing event **/
	publish(eventName, data = undefined) {
		// Debug logging
		if (this._debug) { console.log('Events.publish : options', eventName, data); }
		// Returned value
		let statusCode = false; // Not found status code by default (false)
		// Save event keys to iterate properly on this._events Object
		let keys = Object.keys(this._events);
		// Iterate over saved custom events
		for (let i = 0; i < keys.length; ++i) {
			// If published name match an existing events, we iterate its subscriptions. First subscribed, first served
			if (keys[i] === eventName) {
				// Update status code
				statusCode = true; // Found and published status code (true)
				// Get event subscriptions
				let subs = this._events[keys[i]];
				// Iterate over events subscriptions to find the one with given id
				// Reverse subscriptions iteration to properly splice without messing with iteration order
				for (let j = (subs.length - 1); j >= 0; --j) {
					// Debug logging
					if (this._debug) { console.log(`Events.publish : fire callback for ${eventName}, subscription n°${subs[j].id}`, subs[j]); }
					// Fire saved callback
					subs[j].callback(data);
					// Remove oneShot listener from event entry
					if (subs[j].os) {
						// Debug logging
						if (this._debug) { console.log(`Events.publish : remove subscription because one shot usage is done`); }
						subs.splice(j, 1);
						// Remove event name if no remaining subscriptions
						if (subs.length === 0) {
							delete this._events[keys[i]];
						}
					}
				}
			}
		}
		// Return with status code
		return statusCode;
	}


	/**  ----------  Classic EventListener override  ----------  **/


	addEvent() {
		// TODO
	}


	removeEvent() {
		// TODO
	}


}


export default CustomEvents;
