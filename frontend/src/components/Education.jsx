import React from 'react';
import schoolImg from '../assets/school.jpg';

const educationList = [
  {
    id: 1,
    school: "Dr Sudhir chandra sur institute of technology and sports complex",
    address: "Kolkata, West Bengal",
    board: "MAKAUT",
    year: "2023 - 2026",
    degree: "B.Tech Computer Science and Engineering",
    image: schoolImg
  }
];

const Education = () => {
  return (
    <div id="education" className="w-full mt-16">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 border-b border-gray-200 dark:border-white/10 pb-4">
        Education
      </h3>
      <div className="flex flex-col gap-6">
        {educationList.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] hover:border-primary dark:hover:border-primary transition-all duration-300 shadow-sm dark:shadow-none group overflow-hidden"
          >
            {item.image && (
              <div className="w-full sm:w-2/5 md:w-1/3 h-36 sm:h-auto overflow-hidden bg-gray-100 dark:bg-[#111] border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-white/5 relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/50 to-transparent z-10 hidden dark:block"></div>
                <img
                  src={item.image}
                  alt={item.school}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 z-0"
                />
              </div>
            )}

            <div className="w-full sm:w-3/5 md:w-2/3 p-4 sm:p-5 flex flex-col justify-center flex-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 transition-colors leading-tight">
                {item.school}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-[14px] mb-0.5 transition-colors font-medium">
                {item.address}
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-[14px] mb-3 flex-1 transition-colors">
                {item.board}
              </p>

              <div className="flex flex-wrap items-center gap-2 mt-auto">
                {item.degree && (
                  <span className="px-2.5 py-1 text-[11px] font-bold text-primary border border-primary/50 dark:border-primary/50 bg-primary/5 dark:bg-primary/10 rounded-md uppercase tracking-wider">
                    {item.degree}
                  </span>
                )}
                {item.year && (
                  <span className="px-2.5 py-1 text-[11px] font-bold text-primary border border-primary/50 dark:border-primary/50 bg-primary/5 dark:bg-primary/10 rounded-md uppercase tracking-wider">
                    {item.year}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education;
