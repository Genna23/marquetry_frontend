export function richtextToHtml(richtext) {
  if (!richtext) return '';

  if (typeof richtext === 'string') return richtext;

  if (Array.isArray(richtext)) {
    return richtext.map(richtextToHtml).join('');
  }

  if (richtext.type === 'text') {
    return richtext.text || '';
  }

  if (richtext.content) {
    return richtext.content.map(richtextToHtml).join('');
  }

  return '';
}