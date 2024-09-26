import { Express,Request,Response } from "express";
import Task from "../../../models/task.model"

export const  index = async (req : Request,res: Response)=>{
    interface Find{
        deleted: boolean,
        status?: string,
    }
    // find
    let find: Find = {
        deleted: false,
    }
    if(req.query.status){
        find.status = req.query.status.toString();
    }
    // end find
    // sort
    let sort = {};
    if(req.query.sortKey && req.query.sortValue){
        const sortKey = req.query.sortKey;
        const sortValue = req.query.sortValue;
        sort[`${sortKey}`] = sortValue;
        }
    // end sort

    const tasks = await Task.find(find).sort(sort)
    res.json(tasks)
}

export const detail = async (req: Request,res: Response)=>{
    const id: string = req.params.id;
    const task = await Task.findOne({
        _id: id,
        deleted: false
    })
    res.json(task)

}