export type Response<T = any> = {
    data: T | null
    meta: {
        status: string
        code: number
        message: string
        paginator?: any
    }
}

const isNil = (content: any) => {
    return content === undefined || content === null
}

export function buildSuccessResponse<T = any>(statusCode: number, data: T): Response<T> {
    const message = (data as any)?.message
    let paginator = undefined
    let dataResponse = data

    if (!isNil((data as any)?.message)) {
        delete (data as any).message
    }

    if (!isNil((data as any)?.paginator)) {
        paginator = (data as any).paginator
        delete (data as any).paginator
    }

    if (!isNil((data as any)?.data)) {
        dataResponse = (data as any).data
        delete (data as any).data
    }

    return {
        data: dataResponse,
        meta: {
            status: statusCode >= 200 && statusCode < 300 ? 'success' : 'error',
            code: statusCode,
            message: message ?? "success",
            paginator,
        },
    }
}
