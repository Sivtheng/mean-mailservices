import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// Disable SSL verification for local development
(window as any).global = window;
(window as any).process = {
  env: { DEBUG: undefined },
};

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
