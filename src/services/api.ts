import { authStore, globalStore } from "../store";
import alertStore from "../store/modules/alert-store";
import { TokenUser } from "../store/entities";

interface HttpResponse<T> extends Response {
    parsedBody?: T;
}
 
const fetchTimeout = <T>(request:RequestInfo, ms:number) : Promise<HttpResponse<T>> =>  {
  return new Promise((resolve,reject) => {
    const controller = new AbortController();
    const promise = fetch(request);
    const timeout = setTimeout(() => {
      controller.abort(); 
      reject(new Error("timeout"))
    }, ms);
    promise.finally(() => {clearTimeout(timeout)})
    return resolve(promise);
  })
};

interface IApiInstance {
  baseUrl: string
  get: <T>(path: string, args?: RequestInit) => Promise<HttpResponse<T>>
  post: <T>(path: string, body: any, args?: RequestInit) => Promise<HttpResponse<T>>
  put: <T>(path: string, body: any, args?: RequestInit) => Promise<HttpResponse<T>>
  remove: <T>(path: string, args?: RequestInit) => Promise<HttpResponse<T>>
  http: <T>(request:RequestInfo) => Promise<HttpResponse<T>>
}  
export class ApiInstance implements IApiInstance {
  
    baseUrl: string = ''
    requestTracking: {[url:string]:number} = {}
    connectionFailCount: number = 0
    // pendingRequests: Array<RequestInfo> = []
    async get<T>(path: string, args: RequestInit = { method: "get" }): Promise<HttpResponse<T>> {
      path = this.checkToUseBaseUrl(path);
      args = this.checkForAuth(args, path);
      return await this.http<T>(new Request(path, args));
    };

    async post<T>(
      path: string,
      body: any,
      args: RequestInit = { method: "post", body: JSON.stringify(body), headers:{'Content-Type': 'application/json'} }
    ): Promise<HttpResponse<T>>  {
      path = this.checkToUseBaseUrl(path);
      args = this.checkForAuth(args, path);
      body = args.headers['Content-Type'] && args.headers['Content-Type'] == 'application/json' ? JSON.stringify(body) : body;
      args.body = body;
      return await this.http<T>(new Request(path, args), JSON.stringify(body));
    };

    async put<T>(
      path: string,
      body: any,
      args: RequestInit = { method: "put", body: JSON.stringify(body), headers:{'Content-Type': 'application/json'} }
    ): Promise<HttpResponse<T>> {
      path = this.checkToUseBaseUrl(path)
      args = this.checkForAuth(args, path);
      body = args.headers['Content-Type'] && args.headers['Content-Type'] == 'application/json' ? JSON.stringify(body) : body;
      args.body = body;
      console.log("body", body)
      return await this.http<T>(new Request(path, args), body);
    };

    async remove<T>(
      path: string,
      args: RequestInit = { method: "delete" }
    ): Promise<HttpResponse<T>> {
      path = this.checkToUseBaseUrl(path)
      args = this.checkForAuth(args, path);
      return await this.http<T>(new Request(path, args));
    };
  
    async http<T>(
      request: RequestInfo, body?: any
    ): Promise<HttpResponse<T>> {
      if(Object.keys(this.requestTracking).length > 0 && (request as any).url.indexOf('auth') === -1) {
        //we are refreshing token...add to pending request lists
        // this.pendingRequests.push(request);
        return await this.waitForAuthToFinish<T>(request,body);
      }
      return await this.fetchResponse<T>(request, body);
    }
    
    private async fetchResponse<T>(request:RequestInfo, body?:any) {
      let isTimeout = false;
      const response: HttpResponse<T> = await fetchTimeout(
        request, 15000 
      ).catch((ex:any) => {
        if(ex.toString().indexOf('NetworkError') > -1)
          isTimeout = true;
      });
      if(isTimeout) {
        this.connectionFailCount++
        if(this.connectionFailCount > 3) {
          alertStore.addSimpleAlert("You seemed to have lost internet connection: switching to offline mode");
          globalStore.state.shouldUseLocalStorage = true;
          return response;            
        }
      }
      if(response.status == 200 || response.status == 201) {
        this.connectionFailCount = 0;
        delete this.requestTracking[response.url]; //any successfull call should set retry status to false
        try {
          response.parsedBody = await response.json();
        }
        finally {
          return response;  
        }
      } else {
        return this.handleError(request as Request, response, body);
      }
    }
    private async waitForAuthToFinish<T>(request:RequestInfo, body?:any) : Promise<HttpResponse<T>> {
      return new Promise((resolve,reject) => {
        let interval = setInterval(async () => {
          if(Object.keys(this.requestTracking).length === 0) {
            clearInterval(interval);

            let response = await this.fetchResponse<T>(request, body)
            resolve(response)
          }
        }, 200)
      })
    }
    private isSameDomain(path:string) {
      return path.indexOf(apiService.baseUrl) > -1
    }
    private checkForAuth(args:RequestInit, path:string) {
      if(args && args.headers && authStore.isLoggedIn.value && this.isSameDomain(path)) {
        args.headers = Object.assign(args.headers, {'Authorization': `Bearer ${authStore.accessToken.value}` });
      } else if(args && authStore.isLoggedIn.value && this.isSameDomain(path)) {
        args.headers = {'Authorization': `Bearer ${authStore.accessToken.value}`};
      }
      return args;
    }
    private async handleError<T>(request: Request,response: HttpResponse<T>, body?: any) : Promise<HttpResponse<T>> {
      if(response.status === 401) {
        let isRefreshed = false;
        if(request.url && request.url.indexOf('refresh-token') === -1 && !this.requestTracking[request.url]) { 
          //prevent multiple retries - only do once
          this.requestTracking[request.url] = 1;
          isRefreshed = await authStore.refreshToken()
          if(isRefreshed) {
            let args: any = {method: request.method, headers: {...request.headers}};
            if(request.bodyUsed) {
              args.body = JSON.parse(body);
              args.headers['Content-Type'] = 'application/json';
            }
            args = this.checkForAuth(args, request.url);
            //successfully refreshed token...let's try again
            delete this.requestTracking[request.url];
            return this.http(new Request(request.url, args));
          } 
        } else {
          alertStore.addUnauthorizedAlert();
          delete this.requestTracking[request.url]
          authStore.logout();
          //route to unauthorized page
          // window.location.href = '/unauthorized';
        }
      }
      return response;
    }
    private checkToUseBaseUrl(path:string) : string {
      if(path.indexOf('://') === -1)
        path = this.baseUrl + path;
      return path;
    }

    constructor(baseUrl?:string) {
        if(baseUrl)
          this.baseUrl = baseUrl
    }
}

const apiService = new ApiInstance();
apiService.baseUrl = import.meta.env.VITE_API_URL;//;`https://smallbeans.app/api/v1/`
export {apiService}
