module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*",
        },
        coverage: {
            host: "127.0.0.1",
            port: 8555,
            network_id: "*",
            gas: 0xfffffffffff,
            gasPrice:0x01,
        },
    },

    compilers: {
        solc: {
            version: "0.5.8",
        },
    },
};
