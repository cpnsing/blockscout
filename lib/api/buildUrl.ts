import { compile } from 'path-to-regexp';

import appConfig from 'configs/app/config';

import isNeedProxy from './isNeedProxy';
import { RESOURCES } from './resources';
import type { ApiResource, ResourceName, ResourcePathParams } from './resources';

export default function buildUrl<R extends ResourceName>(
  resourceName: R,
  pathParams?: ResourcePathParams<R>,
  queryParams?: Record<string, string | Array<string> | number | null | undefined>,
): string {
  const resource: ApiResource = RESOURCES[resourceName];
  const baseUrl = isNeedProxy() ? appConfig.baseUrl : (resource.endpoint || appConfig.api.endpoint);
  const basePath = resource.basePath !== undefined ? resource.basePath : appConfig.api.basePath;
  const path = isNeedProxy() ? '/node-api/proxy' + basePath + resource.path : basePath + resource.path;
  const url = new URL(compile(path)(pathParams), baseUrl);

  queryParams && Object.entries(queryParams).forEach(([ key, value ]) => {
    // there are some pagination params that can be null or false for the next page
    value !== undefined && value !== '' && url.searchParams.append(key, String(value));
  });

  return url.toString();
}
