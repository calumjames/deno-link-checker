import {parse} from "https://deno.land/std@0.135.0/flags/mod.ts";

import { Database } from './database.ts';

import dayjs from "https://cdn.skypack.dev/dayjs@1.10.4";

const project = parse(Deno.args)._[0];
if (!project) Deno.exit();

// Open DB and read data
const db = new Database(`./data/${project}/db.json`);
const data = db.db.documents;

// Generate the responses report
let master = "url,hyperlinks,status,redirected,location";
for (const item of data) {
    master += `\n${item.url},"${item.hyperlinks}",${item.status},"${item.redirected ? 'Redirected' : ''}", ${item.redirected ? item.location : 'N/A'}`;
}
Deno.writeTextFileSync(`./reports/hyperlinks/hyperlinks.csv`, master);
