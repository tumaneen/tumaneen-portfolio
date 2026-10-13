import React, { useState, useMemo } from 'react';
import { Project, ProjectCategory } from '../types/portfolio';
import { BrandingCover } from '../components/BrandingCover';
import { LayoutGrid, List, Search, ArrowUpRight } from 'lucide-react';

interface WorkPageProps {
  projects: Project[];
  onOpenProject: (project: Project) => void;
}

export const WorkPage: React.FC<WorkPageProps> = ({ projects, onOpenProject }) => {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: ProjectCategory; label: string }[] = [
    { id: 'all', label: 'ALL WORKS' },
    { id: 'brand-identity', label: 'BRAND IDENTITY & PACKAGING' },
  ];

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory =
        selectedCategory === 'all' ? true : p.categorySlug === selectedCategory;
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-16 space-y-8 sm:space-y-12">
      
      {/* Page Header */}
      <div className="border-b border-orange-500/15 pb-6 sm:pb-8 space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono tracking-[0.25em] text-orange-400 uppercase">
          <span>PORTFOLIO ARCHIVE</span>
          <span className="text-stone-600">/</span>
          <span>2022–2026</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
          <div>
            <h1 className="text-3xl sm:text-6xl font-display font-bold uppercase text-[#ea580c] leading-tight text-glow-orange">
              SELECTED WORKS
            </h1>
            <p className="text-stone-300 text-xs sm:text-base max-w-xl font-sans mt-2 leading-relaxed">
              A curated archive of brand identities, structural packaging architecture, bespoke typography, and sensory unboxing systems crafted for permanence.
            </p>
          </div>

          <div className="text-left md:text-right text-xs font-mono text-stone-400">
            SHOWING <span className="text-orange-400 font-bold">{filteredProjects.length}</span> OF <span className="text-stone-300">{projects.length}</span> PROJECTS
          </div>
        </div>
      </div>

      {/* Filter Toolbar & View Mode Switcher */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4 pb-2 sm:pb-4">
        
        {/* Category Filters (interactive segmented buttons) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded bg-[#120f0d] border border-orange-500/15 max-w-full">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-mono tracking-wider transition-all rounded cursor-pointer ${
                  isActive
                    ? 'bg-orange-500 text-black font-semibold shadow-[0_0_15px_rgba(234,88,12,0.4)]'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Right Search & Grid/List View Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-9 pr-3 py-1.5 rounded bg-[#130f0d] border border-orange-500/20 text-xs font-mono text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          {/* Grid vs List View toggle */}
          <div className="flex items-center p-1 rounded bg-[#120f0d] border border-orange-500/15 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-orange-500/20 text-orange-400' : 'text-stone-500 hover:text-stone-300'
              }`}
              title="Grid View"
              aria-label="Switch to grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-orange-500/20 text-orange-400' : 'text-stone-500 hover:text-stone-300'
              }`}
              title="Editorial List View"
              aria-label="Switch to list view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              onClick={() => onOpenProject(project)}
              className="group cursor-pointer flex flex-col bg-[#110e0c] border border-orange-500/20 hover:border-orange-500/60 transition-all duration-300 overflow-hidden rounded-sm hover:shadow-[0_0_35px_rgba(234,88,12,0.18)]"
            >
              {/* Typographic Branding Cover according to portfolio theme */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#070605]">
                <BrandingCover project={project} size="card" className="w-full h-full" />
              </div>

              {/* Information Row */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4 border-t border-orange-500/15 bg-[#14100d]">
                <div>
                  {/* Clean unboxed metadata per zero-pill rules */}
                  <div className="flex items-center gap-2 text-xs font-mono text-orange-400/90 mb-1">
                    <span className="font-semibold uppercase tracking-wider">{project.brandingType || project.category}</span>
                    <span aria-hidden="true" className="text-orange-500/60">·</span>
                    <span className="text-stone-400">{project.year}</span>
                  </div>

                  <h2 className="text-xl font-display font-bold text-white group-hover:text-orange-400 transition-colors tracking-wide">
                    {project.title}
                  </h2>
                  <p className="text-xs text-stone-400 font-sans mt-1 line-clamp-2">
                    {project.tagline}
                  </p>
                </div>

                <div className="pt-3 border-t border-orange-500/10 flex items-center justify-between text-xs font-mono text-stone-500">
                  <span>Client: {project.client}</span>
                  <span className="text-orange-400 group-hover:underline">VIEW STUDY →</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* List / Table Archive View */}
      {viewMode === 'list' && (
        <div className="border border-orange-500/20 rounded bg-[#110e0c] overflow-x-auto">
          <table className="w-full min-w-[550px] text-left border-collapse">
            <thead>
              <tr className="border-b border-orange-500/20 bg-[#15110d] text-[11px] font-mono uppercase tracking-widest text-stone-400">
                <th className="py-4 px-6 font-medium">INDEX</th>
                <th className="py-4 px-6 font-medium">PROJECT / BRIEF</th>
                <th className="py-4 px-6 font-medium hidden md:table-cell">CLIENT</th>
                <th className="py-4 px-6 font-medium hidden sm:table-cell">BRANDING TYPE</th>
                <th className="py-4 px-6 font-medium text-right">YEAR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-500/10 font-mono text-xs">
              {filteredProjects.map((project) => (
                <tr
                  key={project.id}
                  onClick={() => onOpenProject(project)}
                  className="hover:bg-orange-500/10 transition-colors cursor-pointer group"
                >
                  <td className="py-5 px-6 text-orange-400 font-bold">{project.number}</td>
                  <td className="py-5 px-6">
                    <div className="font-display font-bold text-base sm:text-lg text-white group-hover:text-orange-400 transition-colors">
                      {project.title}
                    </div>
                    <div className="text-[11px] text-stone-400 font-sans">{project.subtitle}</div>
                  </td>
                  <td className="py-5 px-6 text-stone-300 hidden md:table-cell">{project.client}</td>
                  <td className="py-5 px-6 text-orange-400 hidden sm:table-cell uppercase font-semibold">
                    {project.brandingType || project.category}
                  </td>
                  <td className="py-5 px-6 text-right text-stone-400 group-hover:text-orange-400">
                    {project.year} →
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="p-16 text-center border border-orange-500/20 rounded bg-[#120f0d] space-y-3">
          <p className="text-base text-stone-300 font-mono">No projects found matching "{searchQuery}"</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="text-xs font-mono text-orange-400 underline cursor-pointer"
          >
            Clear filters and view all works
          </button>
        </div>
      )}

    </div>
  );
};
