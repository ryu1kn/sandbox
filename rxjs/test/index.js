
const expect = require('chai').expect;
const sinon = require('sinon');

const Rx = require('rx');

describe('RxJS', () => {

  const WAIT_TIME = 300;

  it('processes all events', done => {
    const source = Rx.Observable.from([1, 2, 3]);
    const events = [];
    const observer = Rx.Observer.create(
      data => events.push(data),
      done,
      _ => {
        expect(events).to.eql([1, 2, 3]);
        done();
      }
    );
    source.subscribe(observer);
  });

  it('propagates an error synchronously (but what are the cases?)', () => {
    const source = Rx.Observable.from([1, 2, 3]);
    const observer = Rx.Observer.create(
      _ => { throw new Error('ERROR IN onNext'); }
    );
    expect(() => {
      source.subscribe(observer);
    }).throws(Error, 'ERROR IN onNext');
  });

  it('calls `onError` with the error thrown in the sequence', done => {
    const source = Rx.Observable.from([1, 2, 3]);
    const events = [];
    const observer = Rx.Observer.create(
      data => events.push(data),
      e => {
        expect(e).to.be.an('Error');
        expect(e.message).to.eql('ERROR');
        done();
      },
      _ => {}
    );
    source
      .map(() => { throw new Error('ERROR'); })
      .subscribe(observer);
  });

  it('will not call `onCompleted` if an error occurred', done => {
    const source = Rx.Observable.from([1, 2, 3]);
    const events = [];
    const observer = Rx.Observer.create(
      data => events.push(data),
      _e => {
        setTimeout(done, WAIT_TIME);
      },
      _ => done(new Error('Should not be called'))
    );
    source
      .map(() => { throw new Error('ERROR'); })
      .subscribe(observer);
  });

  it('replays all events for each observer!', done => {
    const source = Rx.Observable.from([1, 2, 3]);
    const events1 = [];
    const events2 = [];
    const observer1 = Rx.Observer.create(
      data => events1.push(data),
      _e => {},
      _ => {source.subscribe(observer2);}
    );
    const observer2 = Rx.Observer.create(
      data => events2.push(data),
      _e => {},
      _ => {
        expect(events2).to.eql([1, 2, 3]);
        done();
      }
    );
    source.subscribe(observer1);
  });

  it('will halt the sequence and not call onCompleted if an error is thrown in the sequence');

});
