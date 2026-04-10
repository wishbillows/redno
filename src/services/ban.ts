import type { AxiosRequestConfig } from 'axios';

export const postFile = (_data: any, options?: AxiosRequestConfig) => {
    // mock.mengxuegu.com does not support file blob upload (returns 413 / CORS error)
    // We mock the upload process locally here to support the progress bar
    return new Promise((resolve) => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            if (options?.onUploadProgress) {
                // Simulate an event object with loaded and total
                options.onUploadProgress({ loaded: progress, total: 100 } as any);
            }
            if (progress >= 100) {
                clearInterval(interval);
                resolve({ data: { url: 'https://demo.com/fake-image.png' } });
            }
        }, 100); // 100ms per 10% progress
    });
}