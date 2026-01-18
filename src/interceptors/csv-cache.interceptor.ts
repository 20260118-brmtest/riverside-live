import { HttpRequest, HttpHeaders, HttpEvent, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';

export function csvCacheInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const transformedReq = req.url.endsWith('.csv')
    ? req.clone({
        headers: new HttpHeaders({
          'Cache-Control': 'no-store',
          Pragma: 'no-store',
        }),
      })
    : req;

  return next(transformedReq);
}
