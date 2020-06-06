/// <reference path='../../shared-types/index.d.ts' />
/// <reference types="react-scripts" />

declare namespace Client {
    type APIResponseResult = Omit<APIResponse, "data">;
}

interface Window {
    ga: any
}