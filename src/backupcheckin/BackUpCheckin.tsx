import { useEffect, useState } from "react";
import IndexedDBClass from "../indexedDb/IndexedDB";

export type entryType = {
    id?: number,
    documento: string,
    data: string,
    sincronizado?: string
    // acao: string,
}

export function BackUpChecking() {
    const [isOnline, setIsOnline] = useState<boolean>(true);
    const [index, setIndex] = useState<number>(0)
    const [insertTeste, setInsertTeste] = useState<boolean>(false)
    const indexedDB = new IndexedDBClass()

    // useEffect(() => {
    //     const handleOnline = () => setIsOnline(true);
    //     const handleOffline = () => setIsOnline(false);

    //     window.addEventListener('online', handleOnline);
    //     window.addEventListener('offline', handleOffline);

    //     return () => {
    //         window.removeEventListener('online', handleOnline);
    //         window.removeEventListener('offline', handleOffline);
    //     };
    // }, []);window.navigator.onLine

    function obterDataFormatada() { return new Date().toISOString() }

    async function insertSql(data: entryType) {
        return await fetch('http://localhost:3000/entry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    }

    async function updateSincronizado(data: entryType) { return await indexedDB.updateEntry(data) }

    async function verifyEntryinSql(data: entryType) {
        return await fetch('http://localhost:3000/entry/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ documento: data.documento, data: data.data }),
        });
    }

    async function InsertInto(doc: string) {
        try {
            const inputData = {
                documento: doc,
                data: obterDataFormatada(),
                sincronizado: ''
                // acao: action,
            }
            const localResponse = await indexedDB.addEntry(inputData)
            if (!localResponse) throw new WebTransportError()
            const localInsertedData = await indexedDB.getEntryByID(localResponse)
            if (!localInsertedData) throw new WebTransportError()

            if (isOnline) {
                const response = await insertSql(localInsertedData)
                if (response.status === 201) {
                    localInsertedData.sincronizado = new Date().toISOString()
                    const updateData = await updateSincronizado(localInsertedData)
                } else {
                    console.log("Insert FAILED")
                }
                console.log("sql insertion", response)

            } else {
                console.warn("Offline Mode")
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (insertTeste) {
                InsertInto(String(index))
                setIndex(index + 1)
            }
        }, 8000)

        return () => {
            clearInterval(interval);
        }
    }, [index,insertTeste])
    
    useEffect(() => {
        // const intervalSync = setInterval(() => {
        //     console.log("syncando database")
        //     syncDatabase();

        // }, 50000)

        const intervalOnline = setInterval(() => {
            console.log("mudando status de internet");
            setIsOnline(!isOnline)
        }, 10000)

        return () => {
            clearInterval(intervalOnline);
            // clearInterval(intervalSync);
        }
    }, [])

    async function syncDatabase() {
        let localDB: entryType[] = []

        try {
            const local = await indexedDB.getAllentries()
            localDB = Array(local)[0] || []
            localDB.map(async (x) => {
                const getEntry = await verifyEntryinSql(x)
                // console.log(getEntry.status);

                if (getEntry.status !== 200) {
                    const insertintoSql = await insertSql(x)
                    x.sincronizado = new Date().toISOString()
                    updateSincronizado(x)
                }
            })
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <>
            <div>
                {isOnline ? (<p>Você está online!</p>) : (<p>Você está offline. Verifique sua conexão com a internet.</p>)}
            </div>
            <div style={{ width: "500px", display: "flex", background: "red", justifyContent: "space-around" }}>
                <button onClick={() => { indexedDB.getAllentries() }}> GetAll </button>
                <button onClick={() => { indexedDB.clearAllEntries() }}> Clear </button>
                <button onClick={() => { syncDatabase() }}> sync </button>
            </div>
            <div>
                <p>{insertTeste ? "inserindo automatico" : "não inserindo"}</p>
                <button onClick={() => { setInsertTeste(!insertTeste) }}>{insertTeste ? "parar Teste" : "iniciar Teste"}</button>
            </div>
        </>
    )
}