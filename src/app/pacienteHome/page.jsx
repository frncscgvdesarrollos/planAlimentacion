'use client'
import { useState, useEffect } from 'react';
import { UserAuth } from '../context/AuthContext';
import { getPaciente, getPlan } from '../firebase';

const generateDaysInMonth = (month, year) => {
  const days = [];
  const date = new Date(year, month, 1);

  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return days;
};

export default function PatientHome() {
  const { user } = UserAuth();
  const uid = user?.uid;
  const [patientName, setPatientName] = useState('');
  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('mis-datos');

  useEffect(() => {
    if (!user) return; // Si no hay usuario, no hacer nada

    const fetchData = async () => {
      try {
        const pacienteData = await getPaciente(uid);
        if (pacienteData) {
          setPatientName(pacienteData.name || 'Nombre no disponible');
        }

        if (!pacienteData) {
          window.location.href = "/register";
        }

        const fetchedPlan = await getPlan(pacienteData?.planAlimentacion);
        if (fetchedPlan) {
          setNutritionPlan(fetchedPlan);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <p>Cargando el plan de alimentación...</p>;
  }

  const daysInMonth = generateDaysInMonth(9, 2024); // Octubre 2024 como ejemplo

  return (
    <main className="flex flex-col lg:flex-row min-h-screen py-6">
      <aside className={`bg-cyan-600 dark:bg-gray-900 bg-opacity-90 ${isMenuCollapsed ? 'w-16' : 'w-1/4'} h-screen p-4 transition-width duration-300`}>
        <div className='flex flex-col h-full'>
          <button onClick={() => setIsMenuCollapsed(!isMenuCollapsed)} className='text-white ml-auto mr-2 text-xl mb-6'>
          {isMenuCollapsed ? '▷' : '◁'}
          </button>
          <div className='mb-6'>
            <h2 className={`text-white text-2xl font-semibold mb-2 ${isMenuCollapsed ? 'hidden' : ''}`}>Menú</h2>
          </div>
          <ul className={`flex flex-col space-y-2 ${isMenuCollapsed ? 'hidden' : ''}`}>
            <li className='p-3 text-white text-lg bg-cyan-700 dark:bg-gray-800 rounded-md hover:bg-cyan-800 dark:hover:bg-gray-700 transition-colors'>
              <button onClick={() => setActiveSection('mis-datos')} className='block w-full text-left'>
                Mis datos
              </button>
            </li>
            <li className='p-3 text-white text-lg bg-cyan-700 dark:bg-gray-800 rounded-md hover:bg-cyan-800 dark:hover:bg-gray-700 transition-colors'>
              <button onClick={() => setActiveSection('plan-alimentacion')} className='block w-full text-left'>
                Plan alimentación
              </button>
            </li>
          </ul>
        </div>
      </aside>

      <div className="flex-1 p-4 bg-cyan-100 dark:bg-gray-800">
        {activeSection === 'mis-datos' && (
          <div>
            <h1 className="text-4xl font-bold mb-4">Bienvenido, {patientName}</h1>
            <p className="text-lg mb-6">Aquí están tus datos personales:</p>
            <p className="text-lg">Nombre: {patientName}</p>
          </div>
        )}

        {activeSection === 'plan-alimentacion' && nutritionPlan && (
          <div>
            <h1 className="text-4xl font-bold mb-4">Plan de Alimentación</h1>
            <p className="text-lg mb-6">Aquí está tu plan de alimentación para este mes:</p>
            <div className="overflow-x-auto w-full">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Desayuno</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Almuerzo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merienda</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cena</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {daysInMonth.map(day => {
                    const dateString = day.toISOString().split('T')[0];
                    const dailyPlan = nutritionPlan[dateString] || {};
                    const { breakfast, lunch, snack, dinner } = dailyPlan;
                    return (
                      <tr key={dateString}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dateString}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{breakfast || 'No disponible'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lunch || 'No disponible'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{snack || 'No disponible'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dinner || 'No disponible'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-12 text-center text-sm text-gray-600">
              <h2 className="text-xl font-semibold mb-4">Descripción del Plan de Alimentación</h2>
              <p>{nutritionPlan.description}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
