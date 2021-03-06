import { generateHeaders } from './utils';
import {
    GetJobTypeListResponse,
    GetJobTypeResponse,
    PatchJobTypeRequest,
    PatchJobTypeResponse,
    PostNewJobTypeRequest,
    PostNewJobTypeResponse,
} from '../../../src/typedefs/jobType';

export async function createJobType(
    token: string,
    jobTypeData: PostNewJobTypeRequest,
): Promise<PostNewJobTypeResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/jobType/new`, {
        method: 'POST',
        mode: 'cors',
        headers: generateHeaders(token),
        body: JSON.stringify(jobTypeData),
    });
    return response.json();
}

export async function getJobTypeList(token: string): Promise<GetJobTypeListResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/jobType/list`, {
        method: 'GET',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function getJobTypeListEventType(token: string, eventType: string): Promise<GetJobTypeListResponse> {
    const headers = generateHeaders(token);
    const requestUrl = `${process.env.REACT_APP_API_URL}/api/jobType/list/${eventType}`;
    const response = await fetch(requestUrl, {
        method: 'GET',
        mode: 'cors',
        headers,
    });
    const json = response.json();
    return json;
}

export async function getJobType(token: string, jobTypeID: number): Promise<GetJobTypeResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/jobType/${jobTypeID}`, {
        method: 'GET',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function updateJobType(
    token: string,
    jobTypeID: number,
    jobTypeData: PatchJobTypeRequest,
): Promise<PatchJobTypeResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/jobType/${jobTypeID}`, {
        method: 'PATCH',
        mode: 'cors',
        headers: generateHeaders(token),
        body: JSON.stringify(jobTypeData),
    });
    return response.json();
}
