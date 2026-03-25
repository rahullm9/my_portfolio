import React from 'react';
import { LuBeaker, LuBookOpen, LuGraduationCap } from "react-icons/lu";

const cards = [
  {
    id: 1,
    icon: <LuBeaker size={22} className="text-teal-400" />,
    title: "What I built",
    action: "Projects →",
    tab: "Projects",
    actionColor: "text-amber-500",
    hoverClass: "hover:neon-green dark:hover:neon-green hover:border-teal-400/50 dark:hover:border-teal-400/50",
    gradient: "from-teal-400 to-emerald-600"
  },
  {
    id: 2,
    icon: <LuBookOpen size={22} className="text-pink-500" />,
    title: "Read my story",
    action: "Website →",
    actionColor: "text-blue-500",
    hoverClass: "hover:neon-pink dark:hover:neon-pink hover:border-pink-500/50 dark:hover:border-pink-500/50",
    gradient: "from-pink-500 to-rose-500"
  },
  {
    id: 3,
    icon: <LuGraduationCap size={24} className="text-purple-400" />,
    title: "Hire me!",
    action: "Resume →",
    link: "/resume.pdf",
    actionColor: "text-pink-500",
    hoverClass: "hover:neon-purple dark:hover:neon-purple hover:border-purple-500/50 dark:hover:border-purple-500/50",
    gradient: "from-purple-500 to-[#aa00ee]"
  }
];

const LinkCards = ({ setActiveSection }) => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-md mt-10 md:mt-24 md:ml-auto">
      {cards.map((card) => (
        <div key={card.id} className="relative group">
          <div className={`absolute -inset-0.5 bg-gradient-to-r ${card.gradient} rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-300`}></div>
          <a
            href={card.link || "#"}
            onClick={(e) => {
              if (card.tab && setActiveSection) {
                e.preventDefault();
                setActiveSection(card.tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            target={card.link ? "_blank" : "_self"}
            rel={card.link ? "noopener noreferrer" : ""}
            className={`relative flex items-center justify-between p-5 rounded-xl border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0a0a0a] shadow-sm dark:shadow-none transition-all duration-300 ${card.hoverClass}`}
          >
            <div className="flex items-center space-x-6">
              <div className={`p-0 rounded-lg transition-colors`}>
                {card.icon}
              </div>
              <span className="text-gray-800 dark:text-gray-200 text-[15px] font-medium tracking-wide transition-colors duration-300">{card.title}</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-[1px] h-4 bg-gray-200 dark:bg-white/10 transition-colors duration-300"></div>
              <span className={`${card.actionColor} font-medium text-sm transition-colors group-hover:brightness-125`}>{card.action}</span>
            </div>
          </a>
        </div>
      ))}
    </div>
  );
};

export default LinkCards;
