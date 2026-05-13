import React from 'react';
import { motion } from 'motion/react';

const Stats: React.FC = () => {
  const stats = [
    { label: 'Tasa de Match', value: '85%', color: 'text-blue-600' },
    { label: 'Traslados Anuales', value: '300+', color: 'text-teal-600' },
    { label: 'Tiempo Promedio', value: '15min', color: 'text-blue-500' },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex flex-col md:flex-row items-end gap-12">
        <div className="flex-1">
          <span className="font-label text-blue-600 font-bold tracking-widest uppercase text-xs mb-4 block">
            Nuestro Impacto
          </span>
          <h2 className="font-headline font-extrabold text-4xl lg:text-5xl text-slate-900 max-w-lg">
            Transformando las carreras de salud, un intercambio a la vez.
          </h2>
        </div>
        <div className="flex flex-wrap gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <span className={`block font-headline font-black text-5xl ${stat.color}`}>
                {stat.value}*
              </span>
              <span className="text-slate-500 font-medium text-sm">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="mt-8 text-right text-xs text-slate-400 italic">
        * Estadísticas esperadas en un año.
      </div>
    </section>
  );
};

export default Stats;
