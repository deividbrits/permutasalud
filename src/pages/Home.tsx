import React from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Features from '../components/Features';
import LoginForm from '../components/LoginForm';

const Home: React.FC = () => {
  return (
    <main className="pt-24">
      <Hero />
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="bg-white p-10 rounded-[2rem] shadow-xl h-fit">
            <LoginForm />
          </div>
          <Features />
        </div>
      </section>
      <Stats />
    </main>
  );
};

export default Home;
