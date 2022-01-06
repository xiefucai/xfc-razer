type Listener = (...args: any) => void;
export default class Pubsub {
  constructor() {}

  list: {
    [key: string]: Listener[];
  } = {};

  on = (key: string, listener: Listener) => {
    if (this.list[key]) {
      if (this.list[key].includes(listener)) {
        return;
      }
      this.list[key].push(listener);
    } else {
      this.list[key] = [listener];
    }
  };

  // 发布消息的方法
  publish = (key: string, ...args: any[]) => {
    if (Array.isArray(this.list[key])) {
      this.list[key].forEach((listener) => {
        listener(...args);
      });
    }
  };
}
