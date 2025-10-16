import * as React from 'react';

interface PersonalityTestProps {
  assessmentId?: string;
  onSubmit?: (responses: string[]) => void;
}

const pages: string[][] = [
  [
    'Ritkán vagyok szomorú',
    'Közönyös vagyok mások problémái iránt',
    'Megvalósítom a terveimet',
    'Könnyen barátkozom',
    'Gyorsan megértem a dolgokat',
    'Könnyen kapok haragra',
    'Tisztelem a hatalommal hatalmat',
    'Széthagyom a cuccaimat',
    'Kezembe veszem az irányítást',
    'Élvezem a természet szépségét',
  ],
  [
    'Gyakran kételkedem a dolgokban',
    'Könnyen átélem mások érzéseit',
    'Gyakran pazarlom az időmet',
    'Nehéz engem megismerni',
    'Nehezen értek meg absztrakt gondolatokat',
    'Ritkán vagyok ingerült',
    'Gyakran gondolom, hogy jobb vagyok másoknál',
    'Szeretem a rendet',
    'Erős személyiségem van',
    'Hiszek a művészet fontosságában',
  ],
  [
    'Kellemes érzéseim vannak magammal kapcsolatban',
    'Érdeklődöm más emberek jólétéről',
    'Nehezem veszem rá magamat, hogy nekiálljak a dolgomnak',
    'Távolságot tartok az másoktól',
    'Könnyen kezelek sok információt',
    'Könnyen ki lehet hozni a sodromból',
    'Nem szeretek rámenősnek tűnni',
    'Rendben tartom a dolgaimat',
    'Nem vagyok meggyőző',
    'Szeretsz gondolkodni a dolgokon',
  ],
  [
    'Könnyen érzem magam veszélyben',
    'Nem lehet megzavarni mások igényeivel',
    'Gyakran rontok el dolgokat',
    'Kevés információt osztok meg magamról',
    'Szeretek megoldani komplex problémákat',
    'Könnyen kezelem az érzelmeimet',
    'Kihasználok másokat a saját céljaimra',
    'Időbeosztást követek',
    'Tudom, hogy kell elvarázsolni az embereket',
    'Nagyon el tudok veszek a zenében',
  ],
  [
    'Ritkán érzem magam depressziósnak',
    'Szimpatizálok mások érzéseivel',
    'Befejezem, amit elkezdek',
    'Könnyen megtalálom másokkal a közös hangot',
    'Kerülöm a filozofikus kérdéseket és inkább csevegek',
    'Könnyen változik a hangulatom',
    'Nem szeretem a saját akaratomat érvényesíteni',
    'Nem zavarnak a rendetlen emberek',
    'Nem vagyok vezető típus',
    'Nem érdekel a költészet',
  ],
  [
    'Izgulós vagyok',
    'Nehezen helyezem bele magamat mások helyzetébe',
    'Nehezen koncentrálok a feladatra, amit éppen végzek',
    'Ritkán robbanok szét az izgalomtól',
    'Nem szeretek a nehéz olvasmányokat',
    'Ritkán vesztem el a nyugalmamat',
    'Nem helyezek másokat nyomás alá',
    'A tökéletességre törekszem',
    'Jó vezetőnek látom magamat',
    'Nem látom az érzelmi hátterét egy festménynek',
  ],
  [
    'Könnyel le lehet engem törni',
    'Keveset foglalkozom másokkal',
    'Gyorsan elintézem a dolgaimat',
    'Nem vagyok nagyon beszédes',
    'Nagyon színes a szókincsem',
    'Egy olyan ember vagyok, akinek kedve gyorsan megy fel és le',
    'Megsértek embereket',
    'Nem zavar a rendetlenség',
    'Könnyen rábeszélek embereket dolgokra',
    'Szükségem van rá, hogy szabadon engedjem a kreativitásomat',
  ],
  [
    'Nehéz zavarba hozni',
    'Érdeklődöm mások élete iránt',
    'Tudom, hogy mit csinálok',
    'Kimutatom, ha boldog vagyok',
    'Gyorsan gondolkodom',
    'Nehezem lehet felidegesíteni',
    'Keresem a konfliktust',
    'Nem szeretem a rutint',
    'Nehezen mondom el a véleményemet',
    'Ritkán veszem el a gondolataimban',
  ],
  [
    'Könnyen kiborulok eseményektől',
    'Nincsen puha oldalam',
    'Halogatom el a döntéseimet',
    'Gyakran szórakozom',
    'Lassan tanulok',
    'Könnyen fel lehet zaklatni',
    'Szeretek egy jó vitát',
    'Azt gondolom, hogy a szabályok csak útmutatók',
    'Én vagyok az első, aki cselekszik',
    'Ritkán ábrándozom',
  ],
  [
    'Sok félelmem van',
    'Szeretek másoknak segíteni',
    'Könnyen el lehet vonni a figyelmemet',
    'Nagyon sokat nevetek',
    'Gyorsan tudok új ötletekkel előállni',
    'Könnyű összezavarni engem',
    'Nem a saját érdekeimet tartom előtérben',
    'Minden egyes részletre odafigyelek',
    'Nem vagyok egy határozott személy',
    'Olyan dolgokat látok szépnek, amiket mások nem vesznek észre',
  ],
];

function PersonalityTest({ assessmentId: _assessmentId, onSubmit }: PersonalityTestProps) {
  const [page, setPage] = React.useState(0);
  const [responses, setResponses] = React.useState(Array(100).fill(null) as (string | null)[]);
  const [error, setError] = React.useState(false);

  const handleResponseChange = (index: number, value: string) => {
    const responseIndex = page * 10 + index;
    const newResponses = [...responses];
    newResponses[responseIndex] = value;
    setResponses(newResponses);
    setError(false);
  };

  const handleNextPage = () => {
    // The original validation logic has been commented out on purpose to disable per-page validation.
    /*
    const currentResponses = responses.slice(page * 10, (page + 1) * 10)
    const isPageComplete = currentResponses.every((r) => r !== null)
    if (!isPageComplete) {
      setError(true)
      const firstUnansweredIndex = currentResponses.findIndex(r => r === null)
      if (firstUnansweredIndex !== -1) {
        const element = document.getElementById(`statement-${firstUnansweredIndex}-1`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
      return
    }
    */

    // proceed without validation
    setError(false);
    if (page < pages.length - 1) {
      setPage(page + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const cleanResponses: string[] = responses.map((r: string | null) => r || '');
      if (onSubmit) onSubmit(cleanResponses);
      // In this React Router app we don't navigate here by default; caller can handle navigation.
      // console.log('Finished', assessmentId, cleanResponses)
    }
  };

  const getUnansweredCount = () => {
    const currentResponses = responses.slice(page * 10, (page + 1) * 10);
    return currentResponses.filter((r: string | null) => r === null).length;
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center py-12 px-4 font-sans text-text">
      <div className="w-full max-w-xl p-8 md:p-12 shadow-md border border-muted bg-surface rounded-3xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Személyiségteszt</h2>

        <div className="mb-6">
          <p className="text-base text-center mb-3">
            {page + 1} / {pages.length}
          </p>
          <div className="w-full bg-blue-100 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${((page + 1) / pages.length) * 100}%` }}
            />
          </div>
        </div>

        {pages[page].map((statement, index) => {
          const responseIndex = page * 10 + index;
          const isQuestionAnswered = responses[responseIndex] !== null;
          return (
            <div
              key={index}
              id={`statement-${index}`}
              className={`mb-5 p-5 rounded-xl transition-all duration-200 ${
                !isQuestionAnswered && error ? 'border-2 border-red-400' : ''
              }`}
              style={{
                background: 'linear-gradient(135deg, rgba(37,99,235,0.04), rgba(255,255,255,1))',
              }}
            >
              <p className="mb-4 text-base leading-relaxed">{statement}</p>

              <div className="flex flex-col items-center">
                <div className="flex justify-between w-full mb-3">
                  <span className="text-sm font-semibold">Nem jellemző rám</span>
                  <span className="text-sm font-semibold">Jellemző rám</span>
                </div>

                <div className="flex justify-between w-full max-w-xs md:max-w-md">
                  {[1, 2, 3, 4, 5].map(value => (
                    <label
                      key={value}
                      className="flex flex-col items-center cursor-pointer select-none"
                    >
                      <span className="text-sm text-gray-600 mb-1">{value}</span>
                      <input
                        type="radio"
                        name={`q-${responseIndex}`}
                        value={value}
                        checked={responses[responseIndex] === value.toString()}
                        onChange={() => handleResponseChange(index, value.toString())}
                        id={`statement-${index}-${value}`}
                        className="w-5 h-5 border-2 border-gray-300 rounded-full accent-accent"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        <div className="flex flex-col items-center mt-8">
          {error && (
            <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md flex items-center">
              <svg
                className="h-5 w-5 text-red-600 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M12 9v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 17h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-sm font-medium">
                Kérjük, válaszolj minden kérdésre ({getUnansweredCount()} megválaszolatlan)
              </span>
            </div>
          )}

          <button
            onClick={handleNextPage}
            className="w-full py-3 px-6 text-lg font-semibold text-white rounded-lg shadow bg-accent hover:opacity-95 transition transform"
          >
            {page === pages.length - 1 ? 'Beküld' : 'Következő'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PersonalityTest;
