# xfc-razer

> 1. Tiny implementation for web lock
> 2. async api for indexedDB


## Usage
### 1. add package to your project
``` bash
npm install xfc-razer --save
```
or
``` bash
yarn add xfc-razer
```
### 2. import the class
####  1. LockHolder
``` typescript
import { LockHolder } from 'xfc-razer';
const locker = new LockHolder();

// subscribe message on lock release
locker.puber.on('unlocked', () => {
  console.log('lock has been released');
});

// lock and hold on page loaded
locker.lock('test-locker', () => {
    return new Promise((resolve) => {
      locker.unlock = resolve;
    });
}).catch((err) => {
    console.error(err);
});

// release the lock
document.getElementById('release-btn').addEventListener('click', ()=>{
    if (locker.unlock) {
          locker.unlock();
    }
}, false);
```
#### 2. ADBObjectStore
``` typescript
import { ADBObjectStore } from 'xfc-razer';

interface UsbData {
  VID: number;
  PID: number;
  type: string;
  device_name: string;
}

const start = async() => {
  const database = new ADBObjectStore('usb_devices');
  const db = await database.open({
    version: 1,
    objectStores: [
      {
        name: 'usb',
        keyPath: ['VID', 'PID'],
        autoIncrement: false,
        indexes: [
          {
            name: 'by_vendor_id',
            keyPath: 'VID',
            multiEntry: false,
            unique: false,
          },
          {
            name: 'by_product_id',
            keyPath: 'PID',
            multiEntry: false,
            unique: false,
          },
          {
            name: 'by_type',
            keyPath: 'type',
            multiEntry: false,
            unique: false,
          },
        ],
      },
    ],
  });
  
// add multi records
  {
    const transaction = database.choose('usb', 'readwrite');

    const results = await transaction.add<UsbData>([
      {
        VID: 5426,
        PID: 201,
        type: 'mouse',
        device_name: 'Razer Basilisk Essential',
      },
      {
        VID: 5426,
        PID: 379,
        type: 'keyboard',
        device_name: 'Razer Huntsman Tournament Edition',
      }
    ]);
    console.log('results', results);
  }
  
// add one record
  {
    const transaction = database.choose('usb', 'readwrite');
    const result = await transaction.add<UsbData>({
      VID: 8899,
      PID: 777,
      type: 'mouse aaa',
      device_name: 'ooxx',
    });

    console.log('result', result);
  }
}
```
