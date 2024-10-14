import { EventDispatcher } from './EventDispatcher';

export class EventManager extends EventDispatcher {
  /**
   * <p>增加事件侦听器，以使侦听器能够接收事件通知。</p>
   * <p>如果侦听鼠标事件，则会自动设置自己和父亲节点的属性 mouseEnabled 的值为 true(如果父节点mouseEnabled=false，则停止设置父节点mouseEnabled属性)。</p>
   * @param	type		事件的类型。
   * @param	caller		事件侦听函数的执行域。
   * @param	listener	事件侦听函数。
   * @param	args		（可选）事件侦听函数的回调参数。
   * @return 此 EventDispatcher 对象。
   * @override
   */
  on(
    type: string,
    caller: any,
    listener: Function,
    args: any[] | null = null,
  ): EventDispatcher {
    return this._createListener(type, caller, listener, args, false);
  }

  /**
   * <p>增加事件侦听器，以使侦听器能够接收事件通知，此侦听事件响应一次后则自动移除侦听。</p>
   * <p>如果侦听鼠标事件，则会自动设置自己和父亲节点的属性 mouseEnabled 的值为 true(如果父节点mouseEnabled=false，则停止设置父节点mouseEnabled属性)。</p>
   * @param	type		事件的类型。
   * @param	caller		事件侦听函数的执行域。
   * @param	listener	事件侦听函数。
   * @param	args		（可选）事件侦听函数的回调参数。
   * @return 此 EventDispatcher 对象。
   * @override
   */
  once(
    type: string,
    caller: any,
    listener: Function,
    args: any[] | null = null,
  ): EventDispatcher {
    return this._createListener(type, caller, listener, args, true);
  }
}

export const EventMgr = new EventManager();
