import { handleUpload, type HandleUploadBody, type BlobResult } from '@vercel/blob/server';
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname: string, clientPayload?: string) => {
        // pathname è il nome del file dal client
        // clientPayload sono i dati della programmazione (schedule)
        return {
          allowedContentTypes: ['video/mp4', 'video/quicktime', 'video/x-m4v'],
          tokenPayload: clientPayload, // Passa i dati della programmazione a onUploadCompleted
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }: { blob: BlobResult, tokenPayload: string | null }) => {
        if (!tokenPayload) {
          throw new Error('Token payload is missing');
        }
        const schedule = JSON.parse(tokenPayload);

        console.log('Upload su Blob completato, salvo su KV:', blob.pathname);

        const videoId = blob.pathname;
        const newVideo = {
          id: videoId,
          url: blob.url,
          duration: 0, // Per ora la durata rimane 0
          uploadedAt: new Date().toISOString(),
          schedule,
          isActive: true,
        };

        await kv.hset('videos', { [videoId]: JSON.stringify(newVideo) });
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = (error as Error).message;
    console.error('Errore durante la gestione dell\'upload:', message);
    return NextResponse.json(
      { error: `Errore del server: ${message}` },
      { status: 400 } // L'errore è probabilmente un problema del client
    );
  }
} 