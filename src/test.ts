// Este archivo es el entrypoint de todos los tests de Angular
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: {
  context(path: string, deep?: boolean, filter?: RegExp): {
    keys(): string[];
    <T>(id: string): T;
  };
};

// Inicializar el entorno de testing
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

// Cargar automáticamente todos los archivos *.spec.ts
const context = require.context('./', true, /\.spec\.ts$/);
context.keys().forEach(context);
