import { initDB, useIndexedDB } from "react-indexed-db-hook";
import { DBConfig } from "./dbconfig/DBConfig";
import { entryType } from "../backupcheckin/BackUpCheckin";

initDB(DBConfig);


export default class IndexedDBClass {
    
    private database = useIndexedDB("SimposioLogs");
    constructor(){}

    async  addEntry(data: entryType) {
        try {
            const addResponse = await this.database.add(data)
            console.log("Add Success: ", addResponse)
            return(addResponse)
        } catch (error) {
            console.log(error);
        }
    }

    async  getAllentries() {
        try {
            const getAllResponse = await this.database.getAll();
            console.log(getAllResponse)
            return(getAllResponse)
        } catch (error) {
            console.log(error);
        }
    }

    async  clearAllEntries() {
        try {
            const clearAllResponse = await this.database.clear();
            console.log("Clear: ", true)
        } catch (error) {
            console.log(error);
        }
    }

    async  getEntryByID(id: number) {
        try {
            const getByIDResponse = await this.database.getByID(id);
            console.log(`Entry ID:${id} `, getByIDResponse)
            return(getByIDResponse)
        } catch (error) {
            console.log(error);
        }
    }

    async deleteEntry(id:number) {
        try {
            const addResponse = await this.database.deleteRecord(id)
            console.log("Delete Entry: ", addResponse)
        } catch (error) {
            console.log(error);
        }
    }
    async  updateEntry(newData: entryType,id:number) {
        try {
            const addResponse = await this.database.update(newData)
            console.log("Update Success: ", addResponse)
        } catch (error) {
            console.log(error);
        }
    }


}
