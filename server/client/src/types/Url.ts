

export interface Url {
    originalUrl: string;
    code: string;
    createdAt?: Date 
}

export interface Analytics {
    data: {x:string, y:number}[];
    totalVisitCount: number;
    timeSpanVisitCount: number;
}

export interface UrlState{
    urls: Url[],
	urlCount: number,
	loading: boolean,
	errors: string,
}