import {
  Provider,
  PLATFORM_INITIALIZER,
  PLATFORM_DIRECTIVES,
  PLATFORM_PIPES,
  ExceptionHandler,
  RootRenderer,
  APPLICATION_COMMON_PROVIDERS,
  PLATFORM_COMMON_PROVIDERS,
  OpaqueToken,
  Testability
} from '@angular/core';
import {wtfInit} from '../core_private';
import {COMMON_DIRECTIVES, COMMON_PIPES, FORM_PROVIDERS} from '@angular/common';

import {IS_DART} from './facade/lang';
import {BrowserDomAdapter} from './browser/browser_adapter';
import {BrowserGetTestability} from './browser/testability';
import {getDOM} from './dom/dom_adapter';
import {DOCUMENT} from './dom/dom_tokens';
import {EVENT_MANAGER_PLUGINS, EventManager} from './dom/events/event_manager';
import {DomRootRenderer, DomRootRenderer_} from './dom/dom_renderer';
import {SharedStylesHost} from './dom/shared_styles_host';
import {KeyEventsPlugin} from './dom/events/key_events';
import {ELEMENT_PROBE_PROVIDERS} from './dom/debug/ng_probe';
import {DomEventsPlugin} from './dom/events/dom_events';
import {
  HAMMER_GESTURE_CONFIG,
  HammerGestureConfig,
  HammerGesturesPlugin
} from './dom/events/hammer_gestures'
import {DomSharedStylesHost} from './dom/shared_styles_host';
import {AnimationBuilder} from './animate/animation_builder';
import {BrowserDetails} from './animate/browser_details';

export {Title} from './browser/title';
export {BrowserDomAdapter} from './browser/browser_adapter';
export {enableDebugTools, disableDebugTools} from './browser/tools/tools';
export {By} from './dom/debug/by';

export const BROWSER_PLATFORM_MARKER = /*@ts2dart_const*/ new OpaqueToken('BrowserPlatformMarker');

/**
 * A set of providers to initialize the Angular platform in a web browser.
 *
 * Used automatically by `bootstrap`, or can be passed to {@link platform}.
 */
export const BROWSER_PROVIDERS: Array<any /*Type | Provider | any[]*/> = /*@ts2dart_const*/ [
  {provide: BROWSER_PLATFORM_MARKER, useValue: true},
  PLATFORM_COMMON_PROVIDERS,
  {provide: PLATFORM_INITIALIZER, useValue: initDomAdapter, multi: true},
];

function _exceptionHandler(): ExceptionHandler {
  // !IS_DART is required because we must rethrow exceptions in JS,
  // but must not rethrow exceptions in Dart
  return new ExceptionHandler(getDOM(), !IS_DART);
}

function _document(): any {
  return getDOM().defaultDoc();
}

/**
 * A set of providers to initialize an Angular application in a web browser.
 *
 * Used automatically by `bootstrap`, or can be passed to {@link PlatformRef.application}.
 */
export const BROWSER_APP_COMMON_PROVIDERS: Array<any /*Type | Provider | any[]*/> = /*@ts2dart_const*/ [
  APPLICATION_COMMON_PROVIDERS,
  FORM_PROVIDERS,
  {provide: PLATFORM_PIPES, useValue: COMMON_PIPES, multi: true},
  {provide: PLATFORM_DIRECTIVES, useValue: COMMON_DIRECTIVES, multi: true},
  {provide: ExceptionHandler, useFactory: _exceptionHandler, deps: []},
  {provide: DOCUMENT, useFactory: _document, deps: []},
  {provide: EVENT_MANAGER_PLUGINS, useClass: DomEventsPlugin, multi: true},
  {provide: EVENT_MANAGER_PLUGINS, useClass: KeyEventsPlugin, multi: true},
  {provide: EVENT_MANAGER_PLUGINS, useClass: HammerGesturesPlugin, multi: true},
  {provide: HAMMER_GESTURE_CONFIG, useClass: HammerGestureConfig},
  {provide: DomRootRenderer, useClass: DomRootRenderer_},
  {provide: RootRenderer, useExisting: DomRootRenderer},
  {provide: SharedStylesHost, useExisting: DomSharedStylesHost},
  BrowserDetails,
  AnimationBuilder,
  DomSharedStylesHost,
  Testability,
  EventManager,
  ELEMENT_PROBE_PROVIDERS
];


export {
  HAMMER_GESTURE_CONFIG,
  HammerGestureConfig
} from '../src/dom/events/hammer_gestures'


export function initDomAdapter() {
  BrowserDomAdapter.makeCurrent();
  wtfInit();
  BrowserGetTestability.init();
}
