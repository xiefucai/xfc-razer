import { ADBObjectStore } from './lib/index';

interface UsbData {
  VID: number;
  PID: number;
  type: string;
  device_name: string;
}

const start = async () => {
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
      },
      {
        VID: 5426,
        PID: 479,
        type: 'keyboard',
        device_name: 'Razer Huntsman Tournament Edition',
      },
      {
        VID: 5426,
        PID: 579,
        type: 'keyboard',
        device_name: 'Razer Huntsman Tournament Edition',
      },
      {
        VID: 5426,
        PID: 1000,
        type: 'keyboard',
        device_name: 'Razer Huntsman Tournament Edition',
      },
      {
        VID: 6426,
        PID: 108,
        type: 'keyboard',
        device_name: 'Razer Huntsman Tournament Edition',
      },
      {
        VID: 6426,
        PID: 579,
        type: 'keyboard',
        device_name: 'Razer Huntsman Tournament Edition',
      },
      {
        VID: 6426,
        PID: 888,
        type: 'keyboard',
        device_name: 'Razer Huntsman Tournament Edition',
      },
    ]);
    console.log('results', results);
  }

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
};

start().catch((err) => {
  console.warn('err', err);
});
