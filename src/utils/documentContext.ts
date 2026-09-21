import * as RNFS from '@dr.pogodin/react-native-fs';

export interface LoadedDocument {
  name: string;
  content: string;
  uri: string;
}

/**
 * Lee un archivo de texto o documento compatible desde el almacenamiento local
 * y lo prepara para ser inyectado como contexto de investigación en el chat.
 */
export async function loadDocumentForChat(
  fileUri: string,
  fileName: string,
): Promise<LoadedDocument | null> {
  try {
    // Normalizar la ruta del URI si es necesario en Android/iOS
    const cleanUri = fileUri.startsWith('file://')
      ? fileUri
      : `file://${fileUri}`;

    // Leer el contenido del archivo como texto plano
    const fileContent = await RNFS.readFile(cleanUri, 'utf8');

    if (!fileContent || fileContent.trim().length === 0) {
      throw new Error(
        'El documento está vacío o no se pudo leer su contenido de texto.',
      );
    }

    return {
      name: fileName,
      content: fileContent,
      uri: fileUri,
    };
  } catch (error) {
    console.error('Error al leer el documento para la UCVAG:', error);
    throw error;
  }
}

/**
 * Genera el prompt enriquecido con las instrucciones de citación estricta de autores.
 */
export function buildDocumentPrompt(
  document: LoadedDocument,
  userQuery: string,
): string {
  return `
[DOCUMENTO DE REFERENCIA INSTITUCIONAL UCVAG]
Título/Fuente: ${document.name}
Contenido del documento:
---
${document.content.substring(0, 15000)} {/* Limitamos tamaño para optimizar tokens locales */}
---

INSTRUCCIÓN DE INVESTIGACIÓN:
Actúa como un asistente académico e investigador de la Universidad Campesina de Venezuela "Argimiro Gabaldón". 
Responde a la siguiente consulta del usuario basándote EXCLUSIVAMENTE en el documento de referencia provisto arriba. 
Es obligatorio que cites textualmente al autor, sección o fragmento del libro/documento cuando des una respuesta. Si la información no se encuentra en el documento, indícalo educadamente.

Consulta del usuario: ${userQuery}
  `.trim();
}
