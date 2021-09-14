import { appConfig } from './dep.ts';

async function serveHttp(conn: Deno.Conn) {
    const httpConn = Deno.serveHttp(conn);
    for await (const requestEvent of httpConn) {
        const body = `Your user-agent is:\n\n${requestEvent.request.headers.get(
            "user-agent",
        ) ?? "Unknown"}`;
        requestEvent.respondWith(
            new Response(body, {
                status: 200,
            }),
        );
    }
}

async function app() {
    console.log(appConfig);

    const server = Deno.listen({ port: appConfig.port });
    console.log(`HTTP webserver running.  Access it at:  http://localhost:${appConfig.port}/`);

    for await (const conn of server) {
        serveHttp(conn);
    }

}

await app();