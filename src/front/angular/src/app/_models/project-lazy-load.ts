import { Project } from "./project.model";

export interface ProjectLazyLoad{
    projects: Project[],
    numberOfRecords: number
}