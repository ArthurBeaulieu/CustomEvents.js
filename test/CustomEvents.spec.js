import CustomEvents from '../CustomEvents.js'


let AppEvents = null;


describe('CustomEvents.js unit test', function() {


  beforeEach(() => {
    AppEvents = new CustomEvents();
  });


  it('Validate instanciation', function(done) {
    expect(AppEvents).not.toBe(undefined);
    expect(AppEvents).not.toBe(null);
    expect(AppEvents._debug).toBe(false); // False by default, as local debug var is set to undefined for first test
    expect(Object.keys(AppEvents._customEvents).length).toBe(0); // _customEvents is an empty Object
    expect(AppEvents._regularEvents.length).toBe(0); // _regularEvents is an empty Array
    expect(typeof AppEvents._idIncrementor).toBe('number'); // Incrementor is a number (pseudo randomized)
    done();
  });


  it('Validate instanciation with debug true', function(done) {
    AppEvents = new CustomEvents({ debug: true });
    expect(AppEvents._debug).toBe(true);
    done();
  });


  /* Custom events by name */


  it('Custom event | Validate subscribe', function(done) {
    let called = 0;
    AppEvents.subscribe('TestEvent', data => {
      expect(Object.keys(AppEvents._customEvents['TestEvent']).length).toBe(1);
      expect(AppEvents._customEvents['TestEvent'][0].name).toBe('TestEvent');
      expect(AppEvents._customEvents['TestEvent'][0].os).toBe(false);
      expect(typeof AppEvents._customEvents['TestEvent'][0].callback).toBe('function');
      called++;
    });
    // All subscribe expects will be handle in publish call
    AppEvents.publish('TestEvent');
    // Check proper Events state
    expect(Object.keys(AppEvents._customEvents).length).toBe(1);
    expect(AppEvents._customEvents['TestEvent']).not.toBe(undefined);
    expect(AppEvents._customEvents['TestEvent']).not.toBe(null);
    expect(called).toBe(1);
    // Call again for publish to check incrementation
    AppEvents.publish('TestEvent');
    expect(called).toBe(2);
    done();
  });


  it('Custom event | Validate one shot subscribe', function(done) {
    let called = 0;
    AppEvents.subscribe('TestEvent', data => {
      expect(Object.keys(AppEvents._customEvents['TestEvent']).length).toBe(1); // We only have one subscription on event
      expect(AppEvents._customEvents['TestEvent'][0].name).toBe('TestEvent');
      expect(AppEvents._customEvents['TestEvent'][0].os).toBe(true); // One shot event
      expect(typeof AppEvents._customEvents['TestEvent'][0].callback).toBe('function');
      called++;
    }, true); // Send true for one shot
    // All subscribe expects will be handle in publish call
    AppEvents.publish('TestEvent');
    // Check proper Events state
    expect(Object.keys(AppEvents._customEvents).length).toBe(0);
    expect(called).toBe(1);
    // All subscribe expects will be handle in publish call, we send here data
    AppEvents.publish('TestEvent');
    expect(called).toBe(1);
    done();
  });


  it('Custom event | Validate unsubscribe', function(done) {
    const subsId = AppEvents.subscribe('TestEvent');
    expect(Object.keys(AppEvents._customEvents).length).toBe(1);
    // All subscribe expects will be handle in publish call, we send here data
    AppEvents.unsubscribe(subsId);
    expect(Object.keys(AppEvents._customEvents).length).toBe(0);
    done();
  });


  it('Custom event | Validate callback without data', function(done) {
    AppEvents.subscribe('TestEvent', data => {
      expect(data).toBe(undefined); // Default value for empty data must be undefined
    });
    AppEvents.publish('TestEvent'); // All subscribe expects will be handle in publish call
    done();
  });


  it('Custom event | Validate callback with data', function(done) {
    AppEvents.subscribe('TestEvent', data => {
      expect(JSON.stringify(data)).toBe(`{"passedData":[0,"1"]}`);
    });
    AppEvents.publish('TestEvent', { passedData: [0, '1'] });
    done();
  });


  /* Regular events (addEventListener/removeEventListener) */


  it('Regular event | Validate addEvent', function(done) {
    const testDiv = document.createElement('DIV');
    let called = 0;
    const cb = event => {
      // Test object construction
      expect(AppEvents._regularEvents.length).toBe(1); // We only have one event listener
      expect(AppEvents._regularEvents[0].element).toBe(testDiv);
      expect(AppEvents._regularEvents[0].eventName).toBe('click');
      expect(typeof AppEvents._regularEvents[0].callback).toBe('function');
      expect(AppEvents._regularEvents[0].scope).toBe(testDiv); // Default scope is element
      expect(AppEvents._regularEvents[0].options).toBe(false);
      // Test received event, must be 'click'
      expect(typeof event).toBe('object');
      expect(event.type).toBe('click');
      called++;
    };
    AppEvents.addEvent('click', testDiv, cb);
    testDiv.click();
    expect(called).toBe(1);
    testDiv.click();
    expect(called).toBe(2);
    done();
  });


  it('Regular event | Validate removeEvent', function(done) {
    // Event callback
    let called = 0;
    const cb = () => {
      called++;
    };
    // Fictionnal DOM div
    const testDiv = document.createElement('DIV');
    const evtId = AppEvents.addEvent('click', testDiv, cb);
    // First click
    testDiv.click();
    expect(called).toBe(1);
    expect(AppEvents._regularEvents.length).toBe(1);
    AppEvents.removeEvent(evtId);
    // Second click
    testDiv.click();
    expect(called).toBe(1);
    expect(AppEvents._regularEvents.length).toBe(0);
    done();
  });


});


describe('CustomEvents.js functional test', function() {


  beforeEach(() => {
    AppEvents = new CustomEvents();
  });


  it('Regular event | Validate add/remove event with scope', function(done) {
    let called = 0;
    const testDiv = document.createElement('DIV');
    class TestClass {
      constructor(AppEvents) {
        this.attribute = 'attr-value';
        this.evtId = AppEvents.addEvent('click', testDiv, this.cbWithScope, this);
        this.scopelessEvtId = AppEvents.addEvent('click', testDiv, this.cbWithoutScope);
        /* Testing part */
        expect(AppEvents._regularEvents.length).toBe(2);
        testDiv.click();
        expect(called).toBe(2);
        AppEvents.removeEvent(this.evtId);
        expect(AppEvents._regularEvents.length).toBe(1);
        testDiv.click();
        expect(called).toBe(3);
        AppEvents.removeEvent(this.scopelessEvtId);
        expect(AppEvents._regularEvents.length).toBe(0);
        testDiv.click();
        expect(called).toBe(3);
        done();
      }

      cbWithScope(event) {
        // Check that scope has been preserved in class callback
        expect(this.attribute).toBe('attr-value');
        expect(typeof this.evtId).toBe('number');
        called++;
      }


      cbWithoutScope(event) {
        // Check that scope is element one
        expect(this).toBe(testDiv);
        called++;
      }
    }
    // In real use case, AppEvents would be imported as component in class definition file
    let instance = new TestClass(AppEvents);
  });


});
