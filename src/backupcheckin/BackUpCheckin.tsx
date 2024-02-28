import { useEffect, useState } from "react";
import IndexedDBClass from "../indexedDb/IndexedDB";

export type entryType = {
    id?: number,
    documento: string,
    data: string,
    acao: string
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

    function obterDataFormatada() {
        const dataAtual = new Date().toISOString();
        return dataAtual

    }

    async function InsertInto(doc: string, action: string) {
        try {

            const inputData = {
                documento: doc,
                acao: action,
                data: obterDataFormatada()
            }
            const localResponse = await indexedDB.addEntry(inputData)
            if (!localResponse) throw new WebTransportError()
            const localInsertedData = await indexedDB.getEntryByID(localResponse)
            if (!localInsertedData) throw new WebTransportError()

            if (isOnline) {
                const response = await fetch('http://localhost:3000/entry', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(localInsertedData),
                });
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
    //     },23999)
    //     return () => clearInterval(interval);
    // },[isOnline])

    // const insert = useEffect(()=>{
    //     const interval = setInterval(()=>{
    //         InsertInto("54698712354", "ENTRADA")
    //     },8000)
    //     return () => clearInterval(interval);
    // })

    async function getEntryDatabase() {
        try {
            const response = await fetch('http://localhost:3000/entry');

            if (!response.ok) throw new Error(`Erro de rede: ${response.status}`);

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro na requisição:', error);
            throw error; // Pode ser interessante lançar o erro novamente para que seja tratado externamente, se necessário.
        }
    }

  

    // useEffect(() => {
    //     syncDatabase()

    // }, [])



    return (
        <>
            <div>
                {isOnline ? (
                    <p>Você está online!</p>
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