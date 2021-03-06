// @flow

import * as rtl from 'react-testing-library';
import {
  resetPlugins,
  registerPlugin,
  getPlugins,
  getPluginContext,
  getPluginApi
} from 'react-plugin';

let pluginId: number = 0;

export function cleanup() {
  rtl.cleanup();
  resetPlugins();
}

export function getPluginState(pluginName: string) {
  return getPluginContext(pluginName).getState();
}

export function mockConfig(pluginName: string, config: {}) {
  ensurePlugin(pluginName).defaultConfig = config;
}

export function mockState(pluginName: string, state: any) {
  ensurePlugin(pluginName).initialState = state;
}

export function mockEvent(eventPath: string, handler: Function) {
  registerFreshPlugin().on(eventPath, handler);
}

export function mockMethod(methodPath: string, handler: Function) {
  const [pluginName, methodName] = methodPath.split('.');
  ensurePluginApi(pluginName).method(methodName, handler);
}

export function mockInit(pluginName: string, handler: Function) {
  ensurePluginApi(pluginName).init(handler);
}

export function mockPlug(plug: Object) {
  registerFreshPlugin().plug(plug);
}

export function mockInitCall(methodPath: string, ...args: any[]): Promise<any> {
  return new Promise(resolve => {
    registerFreshPlugin().init(({ callMethod }) => {
      resolve(callMethod(methodPath, ...args));
    });
  });
}

export function mockInitEmit(eventPath: string, ...args: any[]) {
  const [pluginName, eventName] = eventPath.split('.');
  ensurePluginApi(pluginName).init(({ emitEvent }) => {
    emitEvent(eventName, ...args);
  });
}

function registerFreshPlugin() {
  return registerPlugin({ name: `test${pluginId++}` });
}

function ensurePlugin(pluginName: string) {
  const plugins = getPlugins();

  if (!plugins[pluginName]) {
    registerPlugin({ name: pluginName });
  }

  return plugins[pluginName];
}

function ensurePluginApi(pluginName: string) {
  ensurePlugin(pluginName);

  return getPluginApi(pluginName);
}
