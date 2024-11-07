import React from 'react';
import { Star, Calendar, MapPin } from 'lucide-react';

export function Professionals() {
  const professionals = [
    {
      id: 1,
      name: 'Dra. Maria Silva',
      specialty: 'Terapeuta Ocupacional',
      rating: 4.8,
      reviews: 124,
      location: 'São Paulo, SP',
      nextAvailable: '2024-03-20T10:00:00',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&h=300'
    },
    {
      id: 2,
      name: 'Dr. João Santos',
      specialty: 'Psicólogo',
      rating: 4.9,
      reviews: 98,
      location: 'Rio de Janeiro, RJ',
      nextAvailable: '2024-03-21T14:30:00',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&h=300'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Profissionais</h2>
            <p className="mt-1 text-sm text-gray-500">
              Encontre especialistas qualificados
            </p>
          </div>
          <div className="flex space-x-2">
            <select className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              <option>Todas Especialidades</option>
              <option>Terapia Ocupacional</option>
              <option>Psicologia</option>
              <option>Fonoaudiologia</option>
            </select>
            <select className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              <option>Todas Localidades</option>
              <option>São Paulo</option>
              <option>Rio de Janeiro</option>
              <option>Outros Estados</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {professionals.map((professional) => (
          <div
            key={professional.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <img
                  src={professional.image}
                  alt={professional.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {professional.name}
                </h3>
                <p className="text-sm text-gray-500">{professional.specialty}</p>
                <div className="mt-2 flex items-center">
                  <div className="flex items-center text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">
                      {professional.rating}
                    </span>
                  </div>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-sm text-gray-500">
                    {professional.reviews} avaliações
                  </span>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  {professional.location}
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  Próxima disponibilidade:{' '}
                  {new Date(professional.nextAvailable).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                Agendar Consulta
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}