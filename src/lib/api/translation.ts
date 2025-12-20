import apiClient from './client';

export type TranslateRequest = {
  title?: string;
  description?: string;
  target_language: string;
};

export type TranslateResponse = {
  translated_title: string;
  translated_description: string;
  detected_source_language: string;
};

/**
 * POST /translate
 * Translates product listing content.
 */
async function translateContent(payload: TranslateRequest): Promise<TranslateResponse> {
  const response = await apiClient.post<TranslateResponse>('/translate', payload, {
    validateStatus: (status) => status === 200,
  });

  return response.data;
}

export const translationApi = {
  translateContent,
};
