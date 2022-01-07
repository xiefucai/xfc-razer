import { rootElem, locker, actions } from './lib/page';

actions.steal = async () => {
  locker.stealLock('test-locker', () => {
    return new Promise((resolve) => {
      locker.unlock = resolve;
    });
  });
};

locker.puber.on('locked', () => {
  rootElem.innerHTML = `locked by current tab`;
});

rootElem.innerHTML = `<input type="button" value="steal" id="steal-btn"/>`;
