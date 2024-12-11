// main.ts
// import { bootstrapApplication } from '@angular/platform-browser';
// import { provideRouter } from '@angular/router';
// import { provideHttpClient } from '@angular/common/http';
// import { AppRoutingModule } from './app/app-routing.module';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
// import { AppComponent } from './app/app.component';

platformBrowserDynamic()
  .bootstrapModule(AppModule) 
  .catch(err => console.error(err)); 

// bootstrapApplication(AppModule, {
//   providers: [
//     provideRouter(AppRoutingModule.routes),
//     provideHttpClient(),
//   ]
// })
//   .catch(err => console.error(err));