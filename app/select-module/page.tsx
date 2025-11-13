'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { getSelectedModule, setSelectedModule, ModuleType, MODULE_NAMES } from '@/lib/module';
import { Building2, Briefcase, Users } from 'lucide-react';

export default function SelectModulePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<ModuleType | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    // If module already selected, redirect to dashboard
    const existingModule = getSelectedModule();
    if (existingModule) {
      router.push('/');
    }
  }, [router]);

  const handleSelect = (module: ModuleType) => {
    setSelected(module);
    setSelectedModule(module);
    // Small delay for visual feedback
    setTimeout(() => {
      router.push('/');
    }, 300);
  };

  const modules: { type: ModuleType; name: string; icon: typeof Building2; description: string }[] = [
    {
      type: 'kethu-groups',
      name: MODULE_NAMES['kethu-groups'],
      icon: Building2,
      description: 'Main business operations',
    },
    {
      type: 'kethu-consults',
      name: MODULE_NAMES['kethu-consults'],
      icon: Briefcase,
      description: 'Consulting services',
    },
    {
      type: 'kethu-mentors',
      name: MODULE_NAMES['kethu-mentors'],
      icon: Users,
      description: 'Mentorship programs',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-4 shadow-lg">
            <img
              src="/log.jpg"
              alt="Kethu Logo"
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Module</h1>
          <p className="text-gray-600">Choose the module you want to work with</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map((module) => {
            const Icon = module.icon;
            const isSelected = selected === module.type;
            
            return (
              <button
                key={module.type}
                onClick={() => handleSelect(module.type)}
                disabled={selected !== null}
                className={`bg-white rounded-lg shadow-lg p-6 text-left transition-all transform hover:scale-105 hover:shadow-xl ${
                  isSelected
                    ? 'ring-4 ring-green-500 border-2 border-green-500'
                    : 'border-2 border-transparent hover:border-green-300'
                } ${selected !== null && !isSelected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 mx-auto">
                  <Icon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">{module.name}</h3>
                <p className="text-sm text-gray-600 text-center">{module.description}</p>
                {isSelected && (
                  <div className="mt-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Selected
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}



