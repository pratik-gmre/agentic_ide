import ky from "ky"
import { NextResponse } from "next/server"
import {toast} from "sonner"

import {z} from "zod"

const editRequestSchema = z.object({
    selectedCode:z.string(),
    fullCode:z.string(),
    instruction:z.string()
})

const editResponseSchema = z.object({
    editedCode:z.string(),
})


type EditRequest = z.infer<typeof editRequestSchema>
type EditResponse = z.infer<typeof editResponseSchema>

export const fetcher = async(
    payload:EditRequest,
    signal:AbortSignal
):Promise<string | null>=>{
try {
    const validatePayload = editRequestSchema.parse(payload)
    
    const response = await ky.post("/api/quick-edit",{
        json:validatePayload,
        signal,
        timeout:30_000, 
        retry:0
    }).json<EditResponse>();
    
    console.log("this is validate payload",response);
    const validatedResponse =  editResponseSchema.parse(response)
    return validatedResponse.editedCode || null;
} catch (error) {
    if(error instanceof Error && error.name === "AbortError"){
        return null
    }
    toast.error("Failed to fetch ai. edited code")
    console.log("this is error",error);
    return null;
    
}
} 