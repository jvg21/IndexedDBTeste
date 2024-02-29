import { useEffect, useState } from "react";
import IndexedDBClass from "../indexedDb/IndexedDB";

export type entryType = {
    id?: number,
    documento: string,
    data: string,
    acao: string,
    sincronizado?: string
}

const entry = {
    documento: "15686545521",
    data: "25/02/2024",
    acao: "ENTRADA"
}
const entry2 = {
    id: 10,
    documento: "15686548621",
    data: "2024-05-30",
    acao: "SAIDA"
}

export function BackUpChecking() {
    const [databaseData, setDatabaseData] = useState()
    const [isOnline, setIsOnline] = useState<boolean>(true);
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

    async function updateSincronizado(data: entryType, id: number) { return await indexedDB.updateEntry(data, id) }

    async function verifyEntryinSql(data: entryType) {
        return await fetch('http://localhost:3000/entry/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ documento: data.documento, acao: data.acao, data: data.data }),
        });
    }

    async function InsertInto(doc: string, action: string) {
        try {

            const inputData = {
                documento: doc,
                acao: action,
                data: obterDataFormatada(),
                sincronizado: ''
            }
            const localResponse = await indexedDB.addEntry(inputData)
            if (!localResponse) throw new WebTransportError()
            const localInsertedData = await indexedDB.getEntryByID(localResponse)
            if (!localInsertedData) throw new WebTransportError()

            if (isOnline) {
                const response = await insertSql(localInsertedData)

                if (response.status === 201) {
                    localInsertedData.sincronizado = new Date().toISOString()
                    const updateData = await updateSincronizado(localInsertedData, localResponse)

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

    // const internetstatus = useEffect(()=>{
    //     const interval = setInterval(()=>{
    //         setIsOnline(!isOnline)
    //     },12000)
    //     return () => clearInterval(interval);
    // },[isOnline])


    // const insert = useEffect(() => {
    //     var index = 0;
    //     const interval = setInterval(() => {
    //         InsertInto("54698712354", "ENTRADA")
    //         if (index === 10) clearInterval(interval)
    //         index += 1
    //     }, 5000)
    //     return () => clearInterval(interval);
    // })


    async function syncDatabase() {
        let localDB: entryType[] = []

        try {
            const local = await indexedDB.getAllentries()
            localDB = Array(local)[0] || []
            localDB.map(async (x) => {
                if (x.sincronizado === '') {
                    const insertintoSql = await insertSql(x)
                    if (insertintoSql.status === 201) {
                        // await indexedDB.deleteEntry(x.id || -1)
                        x.sincronizado = new Date().toISOString()
                        updateSincronizado(x, x.id || 0)
                    }
                } else {
                    const getEntry = await verifyEntryinSql(x)
                    if (getEntry.status !== 200) {
                        const insertintoSql = await insertSql(x)
                        // if (insertintoSql.status === 201) {
                            // await indexedDB.deleteEntry(x.id || -1)
                        // }
                    }


                }
            })

        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <div>
                {isOnline ? (
                    <p>Você está online! { }</p>
                ) : (
                    <p>Você está offline. Verifique sua conexão com a internet.</p>
                )}
            </div>
            <div style={{ width: "500px", display: "flex", background: "red", justifyContent: "space-around" }}>
                <button onClick={() => { indexedDB.addEntry(entry) }}> Add </button>
                <button onClick={() => { indexedDB.getAllentries() }}> GetAll </button>
                <button onClick={() => { InsertInto("54698712354", "ENTRADA") }}>addData</button>
                {/* //             <button onClick={() => { getEntryByID(10) }}> Get </button>*/
    /*             <button onClick={() => { updateEntry(entry2) }}> Update </button>
                <button onClick={() => { clearAllEntries() }}> Clear </button> */}
                <button onClick={() => { indexedDB.deleteEntry(51) }}> Delete </button>
                <button onClick={() => { syncDatabase() }}> sync </button>
            </div>

        </>
    )
}