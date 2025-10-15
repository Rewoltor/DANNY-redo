import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Demographics() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    education: '',
    residence: '',
    healthcareQualification: '',
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save to database
    console.log('Form data:', formData);
    // Navigate to next page (to be created later)
    // router.push('/training');
  };

  const isFormValid = Object.values(formData).every(value => value !== '');

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-bg">
      <div className="max-w-2xl w-full p-6 sm:p-8 lg:p-12 bg-surface rounded-lg shadow-md">
        <h1 className="text-2xl sm:text-3xl mb-8 text-text font-bold text-center">
          Demográfiai adatok
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Age */}
          <div>
            <label htmlFor="age" className="block text-base font-semibold text-text mb-2">
              Kor
            </label>
            <select
              id="age"
              value={formData.age}
              onChange={(e) => handleChange('age', e.target.value)}
              className="w-full px-4 py-3 bg-muted text-text rounded-md border-0 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1.5rem',
              }}
            >
              <option value="">Adja meg a korát</option>
              <option value="18-25">18-25</option>
              <option value="26-35">26-35</option>
              <option value="36-45">36-45</option>
              <option value="46-55">46-55</option>
              <option value="56-65">56-65</option>
              <option value="66+">66+</option>
            </select>
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-base font-semibold text-text mb-2">
              Nem
            </label>
            <select
              id="gender"
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="w-full px-4 py-3 bg-muted text-text rounded-md border-0 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1.5rem',
              }}
            >
              <option value="male">Férfi</option>
              <option value="female">Nő</option>
              <option value="other">Egyéb</option>
              <option value="prefer-not-to-say">Nem kívánom megadni</option>
            </select>
          </div>

          {/* Education */}
          <div>
            <label htmlFor="education" className="block text-base font-semibold text-text mb-2">
              Iskola
            </label>
            <select
              id="education"
              value={formData.education}
              onChange={(e) => handleChange('education', e.target.value)}
              className="w-full px-4 py-3 bg-muted text-text rounded-md border-0 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1.5rem',
              }}
            >
              <option value="">Legmagasabb iskolai végzettsége</option>
              <option value="elementary">Általános iskola</option>
              <option value="high-school">Középiskola</option>
              <option value="bachelors">Alapképzés (BSc)</option>
              <option value="masters">Mesterképzés (MSc)</option>
              <option value="phd">Doktori fokozat (PhD)</option>
            </select>
          </div>

          {/* Residence */}
          <div>
            <label htmlFor="residence" className="block text-base font-semibold text-text mb-2">
              Lakhely
            </label>
            <select
              id="residence"
              value={formData.residence}
              onChange={(e) => handleChange('residence', e.target.value)}
              className="w-full px-4 py-3 bg-muted text-text rounded-md border-0 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1.5rem',
              }}
            >
              <option value="">Adja meg lakhelyét</option>
              <option value="budapest">Budapest</option>
              <option value="county-seat">Megyeszékhely</option>
              <option value="city">Város</option>
              <option value="village">Község/Falu</option>
            </select>
          </div>

          {/* Healthcare Qualification */}
          <div>
            <label htmlFor="healthcareQualification" className="block text-base font-semibold text-text mb-2">
              Egészségügyi végzettség
            </label>
            <select
              id="healthcareQualification"
              value={formData.healthcareQualification}
              onChange={(e) => handleChange('healthcareQualification', e.target.value)}
              className="w-full px-4 py-3 bg-muted text-text rounded-md border-0 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1.5rem',
              }}
            >
              <option value="">Van egészségügyi végzettsége?</option>
              <option value="none">Nincs</option>
              <option value="nurse">Ápoló/Asszisztens</option>
              <option value="medical-student">Orvostanhallgató</option>
              <option value="doctor">Orvos</option>
              <option value="radiologist">Radiológus</option>
              <option value="other-healthcare">Egyéb egészségügyi</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={!isFormValid}
              className="w-full px-6 py-3 bg-accent text-white font-semibold rounded-md transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            >
              Teszt kezdése
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
