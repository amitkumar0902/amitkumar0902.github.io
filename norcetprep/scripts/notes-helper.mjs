// Compact helper for authoring note entries.
// n(definition, keyPoints, sources, clinicalContext, nursingPriority, pearls?, redFlags?, videoIds?)
export function n(definition, keyPoints, sources, clinicalContext, nursingPriority, pearls, redFlags, videoIds) {
  const out = {
    definition,
    keyPoints: Array.isArray(keyPoints) ? keyPoints : String(keyPoints).split(';').map(s => s.trim()).filter(Boolean),
    sources: Array.isArray(sources) ? sources : [sources].filter(Boolean),
    clinicalContext,
    nursingPriority,
  };
  if (pearls) out.pearls = Array.isArray(pearls) ? pearls : [pearls];
  if (redFlags) out.redFlags = Array.isArray(redFlags) ? redFlags : [redFlags];
  if (videoIds) out.videoIds = Array.isArray(videoIds) ? videoIds : [videoIds];
  return out;
}
