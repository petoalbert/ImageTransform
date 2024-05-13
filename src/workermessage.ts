import { Pixel } from "./pixel"

export type WorkerMessage = {
    colors: Pixel[],
    inProgress: boolean
}