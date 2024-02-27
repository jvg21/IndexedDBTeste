import { initDB, useIndexedDB } from "react-indexed-db-hook";
import { DBConfig } from "./dbconfig/DBConfig";
import { useEffect, useState } from "react";

initDB(DBConfig);

type entryType = {
    documento: string,
    data: string,
    acao: string
}

const entry = {
    documento: "15686548621",
    data: "2024-05-31",
    acao: "ENTRADA"
}
const entry2 = {
    id: 10,
    documento: "15686548621",
    data: "2024-05-30",
    acao: "SAIDA"
}

export default function IndexedDBClass() {
    const { add, getByID, getAll, update, deleteRecord, clear } = useIndexedDB("SimposioLogs");


    async function addEntry(data: entryType) {
        try {
            const addResponse = await add(data)
            console.log("Add Success: ", addResponse)

        } catch (error) {
            console.log(error);
        }
    }

    async function getAllentries() {
        try {
            const getAllResponse = await getAll();
            console.log(getAllResponse)
        } catch (error) {
            console.log(error);
        }
    }

    async function clearAllEntries() {
        try {
            const clearAllResponse = await clear();
            console.log("Clear: ", true)
        } catch (error) {
            console.log(error);
        }
    }

    async function getEntryByID(id: number) {
        try {
            const getByIDResponse = await getByID(id);
            console.log(`Entry ID:${id} `, getByIDResponse)
        } catch (error) {
            console.log(error);
        }
    }

    async function updateEntry(newData: entryType) {
        try {
            const addResponse = await update(newData)
            console.log("Update Success: ", addResponse)

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div style={{ width: "500px", display: "flex", background: "red", justifyContent: "space-between" }}>
            <button onClick={() => { addEntry(entry) }}> Add </button>
            <button onClick={() => { getEntryByID(10) }}> Get </button>
            <button onClick={() => { getAllentries() }}> GetAll </button>
            <button onClick={() => { updateEntry(entry2) }}> Update </button>
            <button onClick={() => { clearAllEntries() }}> Clear </button>
        </div>
    );

}
