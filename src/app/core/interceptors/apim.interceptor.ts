import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApimInterceptor implements HttpInterceptor {
  private readonly APIM_SUBSCRIPTION_KEY = 'your-apim-subscription-key-here';
  private readonly APIM_HEADER_NAME = 'Ocp-Apim-Subscription-Key';

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.APIM_SUBSCRIPTION_KEY) {
      request = request.clone({
        setHeaders: {
          [this.APIM_HEADER_NAME]: this.APIM_SUBSCRIPTION_KEY
        }
      });
    }

    return next.handle(request);
  }
}