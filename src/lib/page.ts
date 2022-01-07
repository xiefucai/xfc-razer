import LockHolder from './LockHolder';

const locker = new LockHolder();
const actions: { [name: string]: () => Promise<any> } = {
  release: async () => {
    if (locker.unlock) {
      locker.unlock();
    }
  },
};

const rootElem = document.getElementById('root') as HTMLDivElement;
rootElem.addEventListener(
  'click',
  (event: MouseEvent) => {
    const btn = event.target as HTMLInputElement;
    const action = actions[btn.value as string];
    if (btn.id && action) {
      actions[btn.value]
        .bind(btn)()
        .catch((err) => {
          rootElem.innerHTML = err ? err.message : 'error happed';
        });
    }
  },
  false,
);

locker.puber.on('unlocked', () => {
  rootElem.innerHTML = `lock has been released in current tab`;
});

export { rootElem, locker, actions };
