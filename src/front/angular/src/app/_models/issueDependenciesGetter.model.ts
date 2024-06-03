export interface IssueDependenciesGetter{
    id:number;
    name:string;
    isPredecessor:boolean;
    projectName:string;
    groupName:string;
}