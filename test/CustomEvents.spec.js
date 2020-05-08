import CustomEvents from '../CustomEvents.js'


let AppEvents = null;


describe('CustomEvents.js unit test', function() {


  beforeEach(() => {
    AppEvents = new CustomEvents();
  });


  it('CustomEvents.js | Validate instanciation', function(done) {
    expect(AppEvents).not.toBe(undefined);
    expect(AppEvents).not.toBe(null);
    expect(AppEvents._debug).toBe(false); // False by default, as local debug var is set to undefined for first test
    expect(Object.keys(AppEvents._events).length).toBe(0); // _events is an empty Object
    expect(typeof AppEvents._idIncrementor).toBe('number'); // Incrementor is a number (pseudo randomized)
    done();
  });


  it('CustomEvents.js | Validate instanciation with debug true', function(done) {
    AppEvents = new CustomEvents({ debug: true });
    expect(AppEvents._debug).toBe(true);
    done();
  });


  it('CustomEvents.js | Custom event | Validate subscribe', function(done) {
    let called = 0;
    AppEvents.subscribe('TestEvent', data => {
      expect(Object.keys(AppEvents._events['TestEvent']).length).toBe(1);
      expect(AppEvents._events['TestEvent'][0].name).toBe('TestEvent');
      expect(AppEvents._events['TestEvent'][0].os).toBe(false);
      expect(typeof AppEvents._events['TestEvent'][0].callback).toBe('function');
      called++;
    });
    // All subscribe expects will be handle in publish call
    AppEvents.publish('TestEvent');
    // Check proper Events state
    expect(Object.keys(AppEvents._events).length).toBe(1);
    expect(AppEvents._events['TestEvent']).not.toBe(undefined);
    expect(AppEvents._events['TestEvent']).not.toBe(null);
    expect(called).toBe(1);
    // Call again for publish to check incrementation
    AppEvents.publish('TestEvent');
    expect(called).toBe(2);
    done();
  });


  it('CustomEvents.js | Custom event | Validate one shot subscribe', function(done) {
    let called = 0;
    AppEvents.subscribe('TestEvent', data => {
      expect(Object.keys(AppEvents._events['TestEvent']).length).toBe(1); // We only have one subscription on event
      expect(AppEvents._events['TestEvent'][0].name).toBe('TestEvent');
      expect(AppEvents._events['TestEvent'][0].os).toBe(true); // One shot event
      expect(typeof AppEvents._events['TestEvent'][0].callback).toBe('function');
      called++;
    }, true); // Send true for one shot
    // All subscribe expects will be handle in publish call
    AppEvents.publish('TestEvent');
    // Check proper Events state
    expect(Object.keys(AppEvents._events).length).toBe(0);
    expect(called).toBe(1);
    // All subscribe expects will be handle in publish call, we send here data
    AppEvents.publish('TestEvent');
    expect(called).toBe(1);
    done();
  });


  it('CustomEvents.js | Custom event | Validate unsubscribe', function(done) {
    const subsId = AppEvents.subscribe('TestEvent');
    expect(Object.keys(AppEvents._events).length).toBe(1);
    // All subscribe expects will be handle in publish call, we send here data
    AppEvents.unsubscribe(subsId);
    expect(Object.keys(AppEvents._events).length).toBe(0);
    done();
  });


  it('CustomEvents.js | Custom event | Validate callback without data', function(done) {
    AppEvents.subscribe('TestEvent', data => {
      expect(data).toBe(undefined); // Default value for empty data must be undefined
    });
    AppEvents.publish('TestEvent'); // All subscribe expects will be handle in publish call
    done();
  });


  it('CustomEvents.js | Custom event | Validate callback with data', function(done) {
    AppEvents.subscribe('TestEvent', data => {
      expect(JSON.stringify(data)).toBe(`{"passedData":[0,"1"]}`);
    });
    AppEvents.publish('TestEvent', { passedData: [0, '1'] });
    done();
  });


});


// describe('CustomEvents.js functional test', function() {
//
//
//   beforeEach(() => {
//     AppEvents = new CustomEvents();
//   });
//
//
//   it('T01', function(done) {
//     expect(true).toBe(true);
//     done();
//   });
//
//
// });
