import util from 'node:util';

import generatePayload from '../utils/generatePayload.js';

export default async function runCreatePayload(options) {
    const payload = await generatePayload(options);
    console.log(
        util.inspect(payload, {
            depth: null,
            colors: true,
            maxArrayLength: null,
        })
    );
}
