import { createPagesFunctionHandler } from "@remix-run/cloudflare";
import * as build from "@remix-run/dev/server-build";

const handleRequest = createPagesFunctionHandler({
  build,
  mode: process.env.NODE_ENV,
  getLoadContext: (context) => ({
    cloudflare: {
      env: context.env,
      cf: context.cf,
      ctx: context.ctx,
    },
  }),
});

export function onRequest(context) {
  return handleRequest(context);
}
