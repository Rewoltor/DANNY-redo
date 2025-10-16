import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()
  const [consentGiven, setConsentGiven] = useState(false)

  const handleStart = () => {
    if (consentGiven) {
      navigate('/demographics')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-bg">
      <div className="max-w-3xl w-full p-6 sm:p-8 lg:p-12 bg-surface rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h2 className="text-sm uppercase tracking-wide mb-4 text-accent font-semibold">
            Kutatásban való részvétel
          </h2>
          <h1 className="text-2xl sm:text-3xl mb-6 text-text font-bold leading-tight">
            Orvosi képek értékelése mesterséges intelligencia támogatással
          </h1>
          <div className="text-sm text-text leading-normal">
            <p><strong>Kutató:</strong> Baltay Márton, MSc hallgató | <strong>Egyetem:</strong> Pázmány Péter Katolikus Egyetem</p>
            <p className="mt-1"><strong>Témavezető:</strong> [Prof. név]</p>
          </div>
        </div>

        <section className="mb-6">
          <h3 className="text-lg mb-3 text-text font-semibold">
            Mi a feladat?
          </h3>
          <p className="mb-4 text-text leading-relaxed">
            Radiológiai képeken artritisz jelenlétének felismerése – eldönti, van-e artritisz, és megjelöli a gyanús területet.
          </p>

          <h3 className="text-lg mb-3 text-text font-semibold">
            Mennyi idő?
          </h3>
          <p className="mb-2 text-text">
            90-120 perc összesen:
          </p>
          <ul className="list-disc ml-6 mb-6 space-y-1 text-text leading-normal">
            <li>Bevezető előadás (20-30 perc)</li>
            <li>10 gyakorló kép</li>
            <li>Több értékelési szakasz (~30 kép/szakasz)</li>
          </ul>
        </section>

        <section className="mb-6 p-4 rounded-md border-l-4" style={{ backgroundColor: '#fef3c7', borderLeftColor: '#f59e0b' }}>
          <h3 className="text-base mb-3 flex items-center gap-2 font-semibold" style={{ color: '#92400e' }}>
            <span>⚠️</span> Fontos feltételek
          </h3>
          <p className="mb-2 font-semibold" style={{ color: '#78350f' }}>
            A tesztet egyetlen ülésben, megszakítás nélkül kell elvégezni!
          </p>
          <ul className="space-y-1 ml-6" style={{ color: '#78350f' }}>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>Napközben végezze, amikor pihent</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>Biztosítson zavartalan környezetet</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>Nem lehet szünetet tartani vagy kilépni</span>
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-lg mb-3 text-text font-semibold">
            Adatkezelés
          </h3>
          <p className="text-text leading-relaxed">
            Adatai anonimizálva, kizárólag kutatási célra kerülnek felhasználásra.
          </p>
        </section>

        <section className="mb-6">
          <p className="mb-4 text-text font-medium">
            A továbblépéssel kijelentem, hogy:
          </p>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="mt-1 w-4 h-4 cursor-pointer accent-accent"
              />
              <span className="text-text">Elolvastam a tájékoztatót</span>
            </label>
          </div>
        </section>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-muted">
          <p className="text-sm text-text">
            Kérdés? 
            <br />
            <a href="mailto:baltay.marton@gmail.com" className="text-accent underline">[baltay.marton@gmail.com]</a>
            <br />
            <a href="tel:+36203971061" className="text-accent underline">[+36 20 397 1061]</a>
          </p>
          <button
            onClick={handleStart}
            disabled={!consentGiven}
            className="px-6 py-3 bg-accent text-white font-semibold rounded-md transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
          >
            Kezdés
          </button>
        </div>
      </div>
    </main>
  )
}
