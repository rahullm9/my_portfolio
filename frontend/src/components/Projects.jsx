import React from 'react';
import { FiStar } from 'react-icons/fi';
import project1Img from '../assets/project1.png';
import clashkingImg from '../assets/clashking.png';


const projectsList = [
  {
    id: 1,
    title: "Portfolio Website",
    year: "2025",
    description: "The source of this website. A modern, dynamic portfolio template built for developers.",
    image: project1Img,
    source: "https://github.com/rahullm9",
    stack: ["React", "NodeJS", "Tailwind", "CSS"]
  },
  {
    id: 2,
    title: "ClashKing Dashboard (open source)",
    year: "2026",
    description: "Contribution: Fixed role label truncation and improved mobile UX",
    image: clashkingImg,
    source: "https://github.com/rahullm9/ClashKingDashboard",
    stack: ["TypeScript", "Next.js", "Tailwind", "CSS"]
  },

];

const Projects = () => {
  return (
    <div id="projects" className="w-full mt-24 mb-10 max-w-[1000px] mx-auto">
      <h2 className="text-2xl font-bold font-sans tracking-tight mb-8 text-gray-900 dark:text-white transition-colors duration-300">
        Projects
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectsList.map((project) => (
          <div
            key={project.id}
            className="flex flex-col rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] hover:border-primary dark:hover:border-primary transition-all duration-300 shadow-sm dark:shadow-none group overflow-hidden"
          >
            {project.image && (
              <div className="w-full h-44 overflow-hidden bg-gray-100 dark:bg-[#111] border-b border-gray-200 dark:border-white/5 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 hidden dark:block"></div>
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 relative z-0"
                />
              </div>
            )}

            <div className="p-5 flex flex-col flex-1">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-500 dark:text-gray-400 text-[15px] font-medium tracking-wide">
                  {project.year}
                </span>
                {project.stars && (
                  <span className="flex items-center text-gray-800 dark:text-gray-200 text-[15px] font-bold">
                    {project.stars} <FiStar className="ml-1.5 text-amber-400 stroke-[2.5]" />
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-bold text-primary mb-3 transition-colors">
                {project.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 text-[15px] mb-6 flex-1 transition-colors leading-relaxed font-medium">
                {project.description}
              </p>

              {/* Stack Used */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {project.stack.map(tech => (
                  <span key={tech} className="px-2.5 py-1 text-[11px] font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-md uppercase tracking-wider">
                    {tech}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 mt-auto">
                <a
                  href={project.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 text-[13px] font-bold text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-white/20 hover:border-gray-500 dark:hover:border-white/50 bg-transparent rounded-md transition-colors"
                >
                  Source
                </a>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
