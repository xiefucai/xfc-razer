import { rootElem, locker } from './lib/page';

rootElem.innerHTML = 'Requesting a lock';

locker.puber.on('locked', () => {
  rootElem.innerHTML = `<input type="button" value="release" id="release-btn"/>`;
});

locker
  .lock('test-locker', () => {
    return new Promise((resolve) => {
      locker.unlock = resolve;
    });
  })
  .catch((err) => {
    rootElem.innerHTML = `<div style="color: red;">${err.message}</div>`;
  });
