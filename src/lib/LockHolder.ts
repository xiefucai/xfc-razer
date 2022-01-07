/// <reference path="../../types/LockHolder.d.ts" />
// with getLockAndHold and releaseLock member functions.
import Pubsub from './PubSub';

export default class LockHolder {
  state: number = 0;
  controller: AbortController = new AbortController();
  unlock: null | Resolver = null;
  puber;
  constructor() {
    // navigator.userAgent
    this.puber = new Pubsub();
  }

  async lock(lockName: string, doTask: () => void): Promise<Lock> {
    if (typeof navigator.locks === 'undefined') {
      throw new Error('Your browser does not support Web Locks API.');
    }

    return await navigator.locks.request(
      lockName,
      {
        signal: this.controller.signal,
      },
      async (lock: Lock) => {
        this.puber.publish('locked');
        await doTask();
        this.puber.publish('unlocked');
        console.log('unlocked', lock);
      },
    );
  }

  async stealLock(lockName: string, doTask: () => void): Promise<Lock> {
    if (typeof navigator.locks === 'undefined') {
      throw new Error('Your browser does not support Web Locks API.');
    }

    return await navigator.locks.request(
      lockName,
      {
        steal: true,
      },
      async (lock: Lock) => {
        this.puber.publish('locked');
        await doTask();
        this.puber.publish('unlocked');
      },
    );
  }

  async query(): Promise<LockManagerState> {
    return await navigator.locks.query();
  }

  async unLock() {
    this.controller.abort();
  }
}
