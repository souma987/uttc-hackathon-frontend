import {translationApi, type TranslateRequest} from '../api/translation';

export type TranslateParams = TranslateRequest;
export type TranslateResult = {
  translated_title: string,
  translated_description: string,
}

export async function translateListing(
  params: TranslateParams
): Promise<TranslateResult | null> {
  try {
    const response = await translationApi.translateContent(params);
    if (response.detected_source_language == params.target_language) {
      return null;
    } else {
      return { translated_title: response.translated_title, translated_description: response.translated_description};
    }
  } catch (error) {
    console.error('Translation service error:', error);
    return null;
  }
}
