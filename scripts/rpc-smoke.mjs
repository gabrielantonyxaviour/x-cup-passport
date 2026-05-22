const rpcUrl = process.env.X_LAYER_TESTNET_RPC_URL || "https://testrpc.xlayer.tech/terigon";

const response = await fetch(rpcUrl, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "eth_chainId",
    params: [],
  }),
});

if (!response.ok) {
  throw new Error(`RPC HTTP ${response.status}`);
}

const payload = await response.json();
if (payload.error) {
  throw new Error(JSON.stringify(payload.error));
}

const chainId = Number.parseInt(payload.result, 16);
console.log(JSON.stringify({ rpcUrl, chainId, expected: 1952, ok: chainId === 1952 }, null, 2));
if (chainId !== 1952) {
  process.exitCode = 1;
}
