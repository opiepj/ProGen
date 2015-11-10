/// <reference path="../typings/_custom.d.ts" />

export class dispatcher {
  private callbacks: Object;
  private queue: Array < any > ;
  constructor() {
    this.callbacks = {};
    this.queue = [];
    setInterval(function () {
      while (this.queue.length) {
        var event = this.queue[0][0];
        var data = this.queue[0][1];

        this.callbacks[event].forEach(function (callback: Function) {
          callback(data);
        });

        this.queue.splice(0, 1);
      }
    }, 100);
  }

  public addEventListener(event: any, callback: Function) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }

    this.callbacks[event].push(callback);
  }

  public removeAllListeners(event: any) {
    this.callbacks[event] = [];
  }

  public trigger(event: any, data: any) {
    this.queue.push([event, data]);
  }
}
