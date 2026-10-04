/**
 * Un PDF subido a Cloudinary con resource_type 'image' se guarda con
 * su URL terminando en .pdf — eso es necesario para que no se
 * descargue al navegar directo, pero un <img src> del navegador NO
 * puede renderizar un PDF crudo de todas formas. Hace falta pedirle
 * a Cloudinary que lo transforme a imagen (JPG) en la URL misma,
 * insertando el parámetro f_jpg después de /upload/.
 *
 * https://cloudinary.com/cookbook/convert_pdf_to_jpg
 */
export function urlPreviewImagen(url: string): string {
  if (!url.toLowerCase().endsWith('.pdf')) return url
  return url.replace('/upload/', '/upload/f_jpg/')
}
