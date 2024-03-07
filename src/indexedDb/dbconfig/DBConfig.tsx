export const DBConfig = {
  name: "Simposio",
  version: 2.1,
  objectStoresMeta: [
    {
      store: "SimposioLogs",
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        { name: "documento", keypath: "documento", options: { unique: false } },
        { name: "data", keypath: "data", options: { unique: false } },
      ],
    },
    // {
    //   store: "SimposioSQL",
    //   storeConfig: { keyPath: "id", autoIncrement: true },
    //   storeSchema: [
    //     { name: "documento", keypath: "documento", options: { unique: false } },
    //     { name: "data", keypath: "data", options: { unique: false } },
    //     { name: "acao", keypath: "acao", options: { unique: false } }
    //   ],
    // },
  ],
};