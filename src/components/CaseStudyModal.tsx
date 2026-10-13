import React, { useState, useEffect } from 'react';
import { Project } from '../types/portfolio';
import { X, ArrowRight, ArrowLeft, Check, Copy, ExternalLink, Sparkles } from 'lucide-react';
import { BrandingCover } from './BrandingCover';

interface CaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
  onSelectProject: (p: Project) => void;
  allProjects: Project[];
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  project,
  onClose,
  onSelectProject,
  allProjects,
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    setSelectedImage(null);
  }, [project?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  const activeImage = selectedImage || project.image;

  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject = allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length];
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-black/85 backdrop-blur-md overflow-y-auto">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-[#100d0a] border border-orange-500/30 rounded-lg shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-orange-500/20 bg-[#14100c] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-orange-400 font-semibold">{project.number}</span>
            <span className="text-stone-600">/</span>
            <span className="text-xs font-mono uppercase tracking-wider text-stone-300">{project.category}</span>
          </div>

          <div className="flex items-center gap-3">
            {project.behanceUrl && (
              <a
                href={project.behanceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/35 text-xs font-mono text-orange-300 hover:text-white transition-colors"
              >
                <span>VIEW ON BEHANCE</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-orange-500/20 transition-colors cursor-pointer"
              aria-label="Close project modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-10">
          
          {/* Hero Visual Banner: Branding Name Typography by Default, or Selected Behance Artifact */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded overflow-hidden border border-orange-500/20 bg-[#080706]">
            {selectedImage ? (
              <>
                <img
                  src={selectedImage}
                  alt={project.title}
                  className="w-full h-full object-contain sm:object-cover object-center filter contrast-105 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#100d0a] via-transparent to-transparent opacity-80" />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-3 right-3 px-3 py-1 rounded bg-black/85 hover:bg-black border border-orange-500/40 text-[10px] font-mono text-orange-300 hover:text-white uppercase tracking-wider transition-colors cursor-pointer backdrop-blur"
                >
                  Show Branding Cover ↩
                </button>
                <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono text-orange-400 font-semibold uppercase tracking-widest">
                      {project.brandingType || project.category} · Authentic Artifact
                    </span>
                    <h1 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-wide">{project.title}</h1>
                  </div>
                  <span className="text-xs font-mono text-stone-400 sm:text-right">{project.year} · {project.client}</span>
                </div>
              </>
            ) : (
              <BrandingCover project={project} size="hero" className="w-full h-full min-h-[300px] sm:min-h-[400px]" />
            )}
          </div>

          {/* Project Tagline & Quick Specs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 rounded bg-[#15110d] border border-orange-500/15">
            <div className="md:col-span-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-orange-400 block mb-1">Concept</span>
              <p className="text-stone-300 text-sm leading-relaxed">{project.tagline}</p>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-orange-400 block mb-1">Client</span>
              <p className="text-stone-300 text-sm">{project.client}</p>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-orange-400 block mb-1">Role</span>
              <p className="text-stone-300 text-sm">{project.role}</p>
            </div>
          </div>

          {/* Official Behance & Social Links */}
          {(project.behanceUrl || project.instagramUrl) && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded bg-[#15110d] border border-orange-500/20">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                  Official Project Links & Social:
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                {project.behanceUrl && (
                  <a
                    href={project.behanceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-orange-500/15 hover:bg-orange-500/25 text-orange-300 hover:text-orange-200 border border-orange-500/35 hover:border-orange-500/60 text-xs font-mono tracking-wider uppercase transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
                    Behance Case Study
                  </a>
                )}
                {project.instagramUrl && (
                  <a
                    href={project.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-pink-950/30 hover:bg-pink-900/40 text-pink-300 hover:text-pink-200 border border-pink-500/35 hover:border-pink-500/60 text-xs font-mono tracking-wider uppercase transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-pink-400" />
                    Instagram Feature
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Narrative: Challenge & Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-stone-300">
            <div className="space-y-3">
              <h3 className="text-lg font-display font-semibold text-orange-400">The Context & Challenge</h3>
              <p className="text-sm leading-relaxed text-stone-400">{project.challenge}</p>
              <p className="text-sm leading-relaxed text-stone-400">{project.overview}</p>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-display font-semibold text-orange-400">The Visual Solution</h3>
              <p className="text-sm leading-relaxed text-stone-400">{project.solution}</p>
              
              <div className="pt-2">
                <span className="text-xs font-mono text-stone-400 uppercase tracking-wider block mb-2">Key Deliverables</span>
                <ul className="space-y-1.5 text-xs text-stone-300">
                  {project.deliverables.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-orange-500 font-mono">✦</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Color Chemistry Palette with Click-to-Copy */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono uppercase tracking-wider text-orange-400">Color Chemistry</h3>
              <span className="text-[11px] font-mono text-stone-500">CLICK SWATCH TO COPY HEX</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {project.palette.map((c, i) => (
                <button
                  key={i}
                  onClick={() => handleCopyColor(c.hex)}
                  className="p-2.5 rounded bg-[#16120e] border border-orange-500/20 hover:border-orange-500/60 transition-all text-left group cursor-pointer"
                >
                  <div
                    className="w-full h-12 rounded mb-2 border border-black/40 shadow-inner flex items-center justify-center"
                    style={{ backgroundColor: c.hex }}
                  >
                    {copiedHex === c.hex ? (
                      <Check className="w-4 h-4 text-white drop-shadow" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                  <div className="text-[11px] font-medium text-stone-200 truncate">{c.name}</div>
                  <div className="text-[10px] font-mono text-orange-400 uppercase">{c.hex}</div>
                  <div className="text-[9px] text-stone-500">{c.role}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Typography Specimen */}
          <div className="p-6 rounded bg-[#16120e] border border-orange-500/20 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-orange-400">Typography Architecture</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-stone-500 block mb-1">Display Face:</span>
                <p className="font-display text-lg text-white font-semibold">{project.typography.display}</p>
              </div>
              <div>
                <span className="text-stone-500 block mb-1">Body Face:</span>
                <p className="font-mono text-xs text-orange-300">{project.typography.body}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-orange-500/10">
              <span className="text-[10px] font-mono text-stone-500 block mb-1">Specimen Render:</span>
              <p className="font-display italic text-xl sm:text-2xl text-stone-200">
                "{project.typography.sample}"
              </p>
            </div>
          </div>

          {/* Collection Moodboards: Scent Atmospheres if present (Extracted from Case Study) */}
          {project.scents && project.scents.length > 0 && (
            <div className="p-6 rounded bg-[#16120e] border border-orange-500/20 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  <h3 className="text-xs font-mono uppercase tracking-wider text-orange-400">
                    Collection Moodboards · {project.scents.length === 3 ? 'Three Scent Atmospheres' : `${project.scents.length} Scent Atmospheres`}
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-stone-500 uppercase">
                  {project.brandingType === 'CANDLE BRANDING' ? 'Signature Scented Candle Editions' : '50ml Eau De Parfum Lineup'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.scents.map((scent) => (
                  <div
                    key={scent.name}
                    className="p-4 rounded bg-[#120e0c] border border-orange-500/15 space-y-2 hover:border-orange-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: scent.hex }}
                        />
                        <h4 className="font-display font-bold text-base text-white tracking-wider">{scent.name}</h4>
                      </div>
                      <span className="text-[10px] font-mono text-orange-400 uppercase tracking-wider">{scent.atmosphere}</span>
                    </div>
                    <p className="text-xs text-stone-300 font-sans leading-relaxed">{scent.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Outer Packaging Architecture & Vessel Craftsmanship if present */}
          {project.packagingDetails && project.packagingDetails.length > 0 && (
            <div className="p-6 rounded bg-[#16120e] border border-orange-500/20 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                <h3 className="text-xs font-mono uppercase tracking-wider text-orange-400">
                  Outer Packaging & Vessel Craftsmanship
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {project.packagingDetails.map((detail, idx) => (
                  <div key={idx} className="p-3.5 rounded bg-[#120e0c] border border-orange-500/15 space-y-1">
                    <div className="text-xs font-mono text-orange-400 uppercase font-semibold">{detail.label}</div>
                    <p className="text-xs text-stone-300 font-sans leading-relaxed">{detail.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Menu Highlights if present (e.g. for café / hospitality branding) */}
          {project.menuHighlights && project.menuHighlights.length > 0 && (
            <div className="p-6 rounded bg-[#16120e] border border-orange-500/20 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  <h3 className="text-xs font-mono uppercase tracking-wider text-orange-400">
                    Menu Architecture · “A Modern Mehfil”
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-stone-500 uppercase">
                  Curated Café Offerings
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.menuHighlights.map((section) => (
                  <div
                    key={section.category}
                    className="p-4 rounded bg-[#120e0c] border border-orange-500/15 space-y-3"
                  >
                    <div className="text-xs font-mono text-orange-400 uppercase tracking-wider font-semibold border-b border-orange-500/15 pb-2">
                      {section.category}
                    </div>
                    <div className="space-y-2.5">
                      {section.items.map((item) => (
                        <div key={item.name} className="flex items-start justify-between gap-3 text-xs">
                          <div className="space-y-0.5">
                            <span className="text-stone-200 font-medium">{item.name}</span>
                            {item.desc && (
                              <p className="text-[11px] text-stone-400 leading-snug">{item.desc}</p>
                            )}
                          </div>
                          <span className="font-mono text-orange-400 shrink-0 font-semibold">{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Visual Artifacts & Product Gallery if present */}
          {project.gallery && project.gallery.length > 0 && (
            <div className="p-6 rounded bg-[#16120e] border border-orange-500/20 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  <h3 className="text-xs font-mono uppercase tracking-wider text-orange-400">
                    Product Visuals & Monograph Showcase
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-stone-500 uppercase">
                  Click any artifact to inspect in main view
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {project.gallery.map((imgSrc, idx) => {
                  const isSelected = activeImage === imgSrc;
                  const getGalleryLabel = (src: string, index: number) => {
                    // LUMERA Candle Behance gallery
                    if (src.includes('lumera_behance_01')) return 'Brand Identity & Candle Vessels';
                    if (src.includes('lumera_behance_02')) return 'Radiant Sun Symbol & Logotype System';
                    if (src.includes('lumera_behance_03')) return 'Fragrance Trio: Marigold, Casa Rosa & Rain';
                    if (src.includes('lumera_behance_04')) return 'Luxury Rigid Presentation Packaging';
                    if (src.includes('lumera_behance_05')) return 'Arched Label System & Vessel Craft';
                    if (src.includes('lumera_behance_06')) return 'Match Tins & Striker Sets with Sun Motif';
                    if (src.includes('lumera_behance_07')) return 'Boutique Shopping Bags & Tissue Paper';
                    if (src.includes('lumera_behance_08')) return 'Fragrance Atmosphere Story Cards';
                    if (src.includes('lumera_behance_09')) return 'Botanical Linework & Color Chemistry';
                    if (src.includes('lumera_behance_10')) return 'Campaign Art Direction & Ritual Lighting';

                    // RIWAQ Fragrance Behance gallery (ID: 256314323)
                    if (src.includes('riwaq_behance_01')) return 'Dual-Script Brand Architecture ("رواق" / Serif)';
                    if (src.includes('riwaq_behance_02')) return 'Architectural 50ml Flacons & Arch Boxes';
                    if (src.includes('riwaq_behance_03')) return 'Woven Desert Geometries & Pattern System';
                    if (src.includes('riwaq_behance_04')) return 'Laser-Etched Walnut Timber Cap Detail';
                    if (src.includes('riwaq_behance_05')) return 'Four Scent Atmospheres (Layl, Sahra, Noor, Ajwad)';
                    if (src.includes('riwaq_behance_06')) return 'Tactile Arch Window Unboxing Architecture';
                    if (src.includes('riwaq_behance_07')) return 'Boutique Shopping Bag & Letterpress Stationery';
                    if (src.includes('riwaq_behance_08')) return 'Travertine Sanctuary & Desert Scene Mockup';
                    if (src.includes('riwaq_behance_09')) return '2X Clearance Grid & 5-Tone Color Architecture';
                    if (src.includes('riwaq_behance_10')) return 'Editorial Campaign Art Direction & Mood';

                    // ROAST & RHYTHM Café Behance gallery (ID: 254960309)
                    if (src.includes('roast_behance_01')) return 'Octagonal Folded Takeaway Cups & Brand Identity';
                    if (src.includes('roast_behance_02')) return 'Drum Kraft Canister & Whole Bean Pouch';
                    if (src.includes('roast_behance_03')) return 'Treble Clef Ampersand & Wordmark Typography';
                    if (src.includes('roast_behance_04')) return 'Winking Headphone Coffee Cup Mascot';
                    if (src.includes('roast_behance_05')) return 'Scalloped Storefront Architecture & Signage';
                    if (src.includes('roast_behance_06')) return 'Gable Takeaway Carrier Box Suite';
                    if (src.includes('roast_behance_07')) return '"A Modern Mehfil" Menu & Table Stand System';
                    if (src.includes('roast_behance_08')) return 'Bilingual Wall Art ("چائے، گفتگو اور سکون")';
                    if (src.includes('roast_behance_09')) return 'Heavy Canvas Barista Aprons & Uniforms';
                    if (src.includes('roast_behance_10')) return 'Terracotta Coasters & Stamped Paper Napkins';
                    if (src.includes('roast_behance_11')) return 'Illustrated Coffee Cups & Desi Rhythm Pattern';
                    if (src.includes('roast_behance_12')) return 'Ambient Café Lifestyle & Editorial Lighting';
                  };
                  const label = getGalleryLabel(imgSrc, idx);

                  return (
                    <button
                      key={imgSrc}
                      type="button"
                      onClick={() => setSelectedImage(imgSrc)}
                      className={`group relative rounded overflow-hidden border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-orange-500 ring-2 ring-orange-500/30 shadow-[0_0_20px_rgba(234,88,12,0.25)]'
                          : 'border-orange-500/20 hover:border-orange-500/60 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="aspect-[16/10] bg-[#0c0908] overflow-hidden">
                        <img
                          src={imgSrc}
                          alt={`${project.title} - ${label}`}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="p-2.5 bg-[#120e0c] flex items-center justify-between gap-2 border-t border-orange-500/10">
                        <span className="text-[11px] font-mono text-stone-300 group-hover:text-orange-400 transition-colors truncate">
                          {label}
                        </span>
                        {isSelected && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 uppercase shrink-0">
                            Active
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Testimonial / Impact if present */}
          {project.testimonial && (
            <div className="p-6 rounded bg-gradient-to-r from-orange-950/20 via-[#181310] to-[#181310] border-l-2 border-orange-500 space-y-2">
              <p className="text-sm italic text-stone-300 font-serif leading-relaxed">
                "{project.testimonial.quote}"
              </p>
              <div className="text-xs font-mono text-orange-400 pt-1">
                — {project.testimonial.author} <span className="text-stone-500">· {project.testimonial.title}, {project.testimonial.company}</span>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Navigation between Projects */}
        <div className="p-3.5 sm:p-5 border-t border-orange-500/20 bg-[#14100c] flex items-center justify-between gap-3 text-xs font-mono shrink-0">
          <button
            onClick={() => onSelectProject(prevProject)}
            className="flex items-center gap-1.5 sm:gap-2 text-stone-400 hover:text-orange-400 transition-colors cursor-pointer min-w-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline shrink-0">PREVIOUS:</span>
            <span className="truncate">{prevProject.title}</span>
          </button>
          
          <button
            onClick={() => onSelectProject(nextProject)}
            className="flex items-center gap-1.5 sm:gap-2 text-stone-400 hover:text-orange-400 transition-colors cursor-pointer min-w-0"
          >
            <span className="hidden sm:inline shrink-0">NEXT:</span>
            <span className="truncate">{nextProject.title}</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>

      </div>
    </div>
  );
};
