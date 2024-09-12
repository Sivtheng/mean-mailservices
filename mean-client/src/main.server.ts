import 'zone.js/node';
// import { APP_BASE_HREF } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

// Remove the node-fetch import and global.fetch assignment
// import fetch from 'node-fetch';
// global.fetch = fetch as any;

// Remove unused imports
// import { ngExpressEngine } from '@nguniversal/express-engine';
// import * as express from 'express';
// import { join } from 'path';
// import { AppServerModule } from './src/main.server';
// import { existsSync } from 'fs';

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;
