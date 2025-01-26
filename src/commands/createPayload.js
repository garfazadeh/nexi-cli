import util from 'node:util';

import generatePayload from '../utils/generatePayload.js';

export default function runCreatePayload(options) {
    const payload = generatePayload(options);
    console.log(
        util.inspect(payload, {
            depth: null,
            colors: true,
            maxArrayLength: null,
        })
    );
}
