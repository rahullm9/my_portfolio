import React, { useState, useEffect } from 'react';
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';
import Education from './Education';

import {
  SiReact,
  SiNextdotjs,
  SiJavascript,
  SiTypescript,
  SiTailwindcss,
  SiHtml5,
  SiCss,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql
} from 'react-icons/si';

const skills = {
  frontend: [
    { name: "React", icon: <SiReact size={28} />, color: "group-hover:text-[#61DAFB]" },
    { name: "Next.js", icon: <SiNextdotjs size={28} />, color: "group-hover:text-black dark:group-hover:text-white" },
    { name: "JavaScript", icon: <SiJavascript size={28} />, color: "group-hover:text-[#F7DF1E]" },
    { name: "TypeScript", icon: <SiTypescript size={28} />, color: "group-hover:text-[#3178C6]" },
    { name: "Tailwind CSS", icon: <SiTailwindcss size={28} />, color: "group-hover:text-[#06B6D4]" },
    { name: "HTML5", icon: <SiHtml5 size={28} />, color: "group-hover:text-[#E34F26]" },
    { name: "CSS", icon: <SiCss size={28} />, color: "group-hover:text-[#1572B6]" },
  ],
  backend: [
    { name: "Node.js", icon: <SiNodedotjs size={28} />, color: "group-hover:text-[#339933]" },
    { name: "Express", icon: <SiExpress size={28} />, color: "group-hover:text-black dark:group-hover:text-white" },
    { name: "MongoDB", icon: <SiMongodb size={28} />, color: "group-hover:text-[#47A248]" },
    { name: "PostgreSQL", icon: <SiPostgresql size={28} />, color: "group-hover:text-[#4169E1]" },
  ]
};

const About = () => {
  return (
    <div id="about" className="w-full mt-24 mb-10 max-w-[1000px] mx-auto">
      <h2 className="text-3xl font-extrabold font-sans tracking-tight mb-12 text-gray-900 dark:text-white transition-colors duration-300">
        About
      </h2>

      <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
        {/* Left Column: Photo & Details */}
        <div className="w-full md:w-[30%] flex flex-col items-center">
          <div className="relative group mb-6">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
            <img
              src="/profile.png"
              alt="Rahul"
              className="relative w-48 h-48 rounded-full border border-gray-200 dark:border-white/10 object-cover shadow-xl transition-transform duration-500 group-hover:scale-105 bg-gray-100 dark:bg-[#111]"
            />
          </div>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            Rahul Mahato
          </h3>
          <p className="text-gray-600 dark:text-gray-400 font-medium text-[15px] mb-1">
            Full Stack Developer
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mb-6">
            Kolkata, West Bengal, India
          </p>

          <div className="flex gap-4">
            <a href="https://github.com/rahullm9" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md">
              <FiGithub size={18} />
            </a>
            <a href="https://x.com/rahulllmhto" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md">
              <FiTwitter size={18} />
            </a>
            <a href="https://www.linkedin.com/in/rahulmhto" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md">
              <FiLinkedin size={18} />
            </a>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=rahulmahato10101@gmail.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md">
              <FiMail size={18} />
            </a>
          </div>
        </div>

        {/* Right Column: Bio & Skills */}
        <div className="w-full md:w-[70%] flex flex-col">
          <div className="text-gray-700 dark:text-gray-300 text-[16px] leading-[1.8] mb-12 space-y-6">
            <p>
              I’m an aspiring <strong className="text-gray-900 dark:text-gray-100 font-bold">Full Stack Developer</strong> with a strong passion for building modern, scalable, and user-friendly web applications. I enjoy transforming ideas into real-world digital solutions using technologies like JavaScript and the MERN stack.
            </p>
            <p>
              Driven by curiosity and continuous learning, I actively work on projects that enhance my problem-solving abilities and development skills. My goal is to grow as a developer, collaborate with innovative teams, and contribute to impactful software products.
            </p>
            <p>
              When I'm not coding, you can find me exploring new UI/UX trends, contributing to open source, or working on personal side projects that <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded-[4px] font-medium">push the boundaries</span> of what's possible on the web.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 border-b border-gray-200 dark:border-white/10 pb-4">
            Technical Skills
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12">
            {/* Frontend Skills */}
            <div>
              <h4 className="text-lg font-bold text-primary mb-6 flex items-center">
                Frontend <span className="ml-3 h-[1px] flex-1 bg-gray-200 dark:bg-white/10"></span>
              </h4>
              <div className="flex flex-wrap gap-4">
                {skills.frontend.map((skill, index) => (
                  <div
                    key={index}
                    title={skill.name}
                    className="p-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl group transition-all duration-300 hover:-translate-y-2 hover:shadow-lg dark:hover:shadow-none hover:border-primary/50 cursor-pointer"
                  >
                    <div className={`text-gray-600 dark:text-gray-400 transition-colors duration-300 ${skill.color}`}>
                      {skill.icon}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Backend Skills */}
            <div>
              <h4 className="text-lg font-bold text-primary mb-6 flex items-center">
                Backend <span className="ml-3 h-[1px] flex-1 bg-gray-200 dark:bg-white/10"></span>
              </h4>
              <div className="flex flex-wrap gap-4">
                {skills.backend.map((skill, index) => (
                  <div
                    key={index}
                    title={skill.name}
                    className="p-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl group transition-all duration-300 hover:-translate-y-2 hover:shadow-lg dark:hover:shadow-none hover:border-primary/50 cursor-pointer"
                  >
                    <div className={`text-gray-600 dark:text-gray-400 transition-colors duration-300 ${skill.color}`}>
                      {skill.icon}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Education />

        </div>
      </div>
    </div>
  );
};

export default About;
