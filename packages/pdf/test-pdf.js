const { renderToStream } = require('@react-pdf/renderer');
const React = require('react');
const { AssetPassport } = require('@biffco/pdf');

async function main() {
    try {
        const stream = await renderToStream(React.createElement(AssetPassport, {
            asset: { id: "123", type: "cow", ownerId: [], lineageParentIds: [] },
            events: [],
            evidence: []
        }));
        console.log("Stream generated successfully", typeof stream);
    } catch (e) {
        console.error("CRASH:", e);
    }
}
main();
