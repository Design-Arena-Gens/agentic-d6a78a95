import { useState, useEffect } from 'react';
import Head from 'next/head';

// Game images - using emoji placeholders and SVG for visual assets
const BUILDING_IMAGES = {
  townHall: '🏛️',
  barracks: '⚔️',
  warehouse: '📦',
  granary: '🌾',
  woodcutter: '🪵',
  clayPit: '🧱',
  ironMine: '⛏️',
  cropland: '🌿',
  wall: '🏰',
  marketplace: '🏪'
};

const INITIAL_RESOURCES = {
  wood: 500,
  clay: 500,
  iron: 500,
  crop: 500
};

const BUILDINGS = [
  { id: 'townHall', name: 'قاعة المدينة', nameEn: 'Town Hall', cost: { wood: 100, clay: 80, iron: 50, crop: 30 }, production: {} },
  { id: 'barracks', name: 'الثكنات', nameEn: 'Barracks', cost: { wood: 150, clay: 120, iron: 100, crop: 50 }, production: {} },
  { id: 'warehouse', name: 'المستودع', nameEn: 'Warehouse', cost: { wood: 80, clay: 100, iron: 30, crop: 20 }, production: {} },
  { id: 'granary', name: 'صومعة الحبوب', nameEn: 'Granary', cost: { wood: 60, clay: 70, iron: 40, crop: 20 }, production: {} },
  { id: 'woodcutter', name: 'حطاب', nameEn: 'Woodcutter', cost: { wood: 40, clay: 60, iron: 30, crop: 10 }, production: { wood: 5 } },
  { id: 'clayPit', name: 'منجم الطين', nameEn: 'Clay Pit', cost: { wood: 60, clay: 40, iron: 30, crop: 10 }, production: { clay: 5 } },
  { id: 'ironMine', name: 'منجم الحديد', nameEn: 'Iron Mine', cost: { wood: 80, clay: 70, iron: 40, crop: 20 }, production: { iron: 5 } },
  { id: 'cropland', name: 'حقل المحاصيل', nameEn: 'Cropland', cost: { wood: 30, clay: 40, iron: 20, crop: 10 }, production: { crop: 5 } },
  { id: 'wall', name: 'السور', nameEn: 'Wall', cost: { wood: 200, clay: 300, iron: 150, crop: 50 }, production: {} },
  { id: 'marketplace', name: 'السوق', nameEn: 'Marketplace', cost: { wood: 120, clay: 150, iron: 80, crop: 40 }, production: {} }
];

export default function Home() {
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  const [buildings, setBuildings] = useState({});
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [message, setMessage] = useState('');
  const [population, setPopulation] = useState(50);

  // Resource production every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setResources(prev => {
        const newResources = { ...prev };
        Object.entries(buildings).forEach(([buildingId, level]) => {
          const building = BUILDINGS.find(b => b.id === buildingId);
          if (building && building.production) {
            Object.entries(building.production).forEach(([resource, amount]) => {
              newResources[resource] += amount * level;
            });
          }
        });
        return newResources;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [buildings]);

  const canAfford = (cost) => {
    return Object.entries(cost).every(([resource, amount]) => resources[resource] >= amount);
  };

  const buildBuilding = (building) => {
    const currentLevel = buildings[building.id] || 0;
    const multiplier = currentLevel + 1;
    const cost = {
      wood: building.cost.wood * multiplier,
      clay: building.cost.clay * multiplier,
      iron: building.cost.iron * multiplier,
      crop: building.cost.crop * multiplier
    };

    if (canAfford(cost)) {
      setResources(prev => ({
        wood: prev.wood - cost.wood,
        clay: prev.clay - cost.clay,
        iron: prev.iron - cost.iron,
        crop: prev.crop - cost.crop
      }));
      setBuildings(prev => ({
        ...prev,
        [building.id]: (prev[building.id] || 0) + 1
      }));
      setPopulation(prev => prev + 10);
      setMessage(`تم بناء ${building.name} بنجاح! 🎉`);
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('موارد غير كافية! ❌');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <>
      <Head>
        <title>ترافيان - لعبة بناء الإمبراطورية</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="game-container">
        {/* Header */}
        <header className="header">
          <h1>🏰 ترافيان 🏰</h1>
          <p>ابنِ إمبراطوريتك!</p>
        </header>

        {/* Resources Bar */}
        <div className="resources-bar">
          <div className="resource">
            <span className="resource-icon">🪵</span>
            <span className="resource-value">{Math.floor(resources.wood)}</span>
            <span className="resource-name">خشب</span>
          </div>
          <div className="resource">
            <span className="resource-icon">🧱</span>
            <span className="resource-value">{Math.floor(resources.clay)}</span>
            <span className="resource-name">طين</span>
          </div>
          <div className="resource">
            <span className="resource-icon">⛏️</span>
            <span className="resource-value">{Math.floor(resources.iron)}</span>
            <span className="resource-name">حديد</span>
          </div>
          <div className="resource">
            <span className="resource-icon">🌾</span>
            <span className="resource-value">{Math.floor(resources.crop)}</span>
            <span className="resource-name">محاصيل</span>
          </div>
          <div className="resource population">
            <span className="resource-icon">👥</span>
            <span className="resource-value">{population}</span>
            <span className="resource-name">السكان</span>
          </div>
        </div>

        {/* Message */}
        {message && <div className="message">{message}</div>}

        {/* Village View */}
        <div className="village-view">
          <div className="village-grid">
            {/* Image 1: Village Center */}
            <div className="village-image main-village">
              <svg viewBox="0 0 200 200" className="village-svg">
                <rect x="0" y="0" width="200" height="200" fill="#8B7355"/>
                <circle cx="100" cy="100" r="80" fill="#654321"/>
                <rect x="70" y="60" width="60" height="80" fill="#8B4513"/>
                <polygon points="100,30 60,70 140,70" fill="#A0522D"/>
                <rect x="85" y="100" width="30" height="40" fill="#4A3728"/>
                <circle cx="100" cy="50" r="8" fill="#FFD700"/>
              </svg>
              <span className="image-label">القرية الرئيسية</span>
            </div>

            {/* Image 2: Forest/Wood */}
            <div className="village-image">
              <svg viewBox="0 0 200 200" className="village-svg">
                <rect x="0" y="0" width="200" height="200" fill="#228B22"/>
                <polygon points="50,150 30,150 40,80" fill="#006400"/>
                <polygon points="80,150 55,150 67,60" fill="#006400"/>
                <polygon points="120,150 95,150 107,50" fill="#006400"/>
                <polygon points="150,150 125,150 137,70" fill="#006400"/>
                <polygon points="175,150 155,150 165,90" fill="#006400"/>
                <rect x="0" y="150" width="200" height="50" fill="#8B4513"/>
              </svg>
              <span className="image-label">الغابة 🪵 {buildings.woodcutter ? `(${buildings.woodcutter})` : ''}</span>
            </div>

            {/* Image 3: Clay Pit */}
            <div className="village-image">
              <svg viewBox="0 0 200 200" className="village-svg">
                <rect x="0" y="0" width="200" height="200" fill="#D2691E"/>
                <ellipse cx="100" cy="120" rx="70" ry="40" fill="#8B4513"/>
                <ellipse cx="100" cy="110" rx="50" ry="25" fill="#A0522D"/>
                <rect x="140" y="80" width="15" height="60" fill="#654321"/>
                <rect x="145" y="70" width="25" height="15" fill="#4A3728"/>
              </svg>
              <span className="image-label">منجم الطين 🧱 {buildings.clayPit ? `(${buildings.clayPit})` : ''}</span>
            </div>

            {/* Image 4: Iron Mine */}
            <div className="village-image">
              <svg viewBox="0 0 200 200" className="village-svg">
                <rect x="0" y="0" width="200" height="200" fill="#696969"/>
                <polygon points="100,20 30,100 170,100" fill="#808080"/>
                <rect x="70" y="100" width="60" height="80" fill="#2F4F4F"/>
                <rect x="85" y="120" width="30" height="40" fill="#1C1C1C"/>
                <circle cx="60" cy="60" r="10" fill="#C0C0C0"/>
                <circle cx="140" cy="70" r="8" fill="#C0C0C0"/>
              </svg>
              <span className="image-label">منجم الحديد ⛏️ {buildings.ironMine ? `(${buildings.ironMine})` : ''}</span>
            </div>

            {/* Image 5: Cropland */}
            <div className="village-image">
              <svg viewBox="0 0 200 200" className="village-svg">
                <rect x="0" y="0" width="200" height="200" fill="#90EE90"/>
                <rect x="20" y="40" width="160" height="20" fill="#FFD700"/>
                <rect x="20" y="80" width="160" height="20" fill="#FFD700"/>
                <rect x="20" y="120" width="160" height="20" fill="#FFD700"/>
                <rect x="20" y="160" width="160" height="20" fill="#FFD700"/>
                <circle cx="170" cy="30" r="20" fill="#FFFF00"/>
              </svg>
              <span className="image-label">حقل المحاصيل 🌾 {buildings.cropland ? `(${buildings.cropland})` : ''}</span>
            </div>

            {/* Image 6: Barracks */}
            <div className="village-image">
              <svg viewBox="0 0 200 200" className="village-svg">
                <rect x="0" y="0" width="200" height="200" fill="#CD853F"/>
                <rect x="30" y="80" width="140" height="100" fill="#8B0000"/>
                <polygon points="100,30 20,90 180,90" fill="#A52A2A"/>
                <rect x="60" y="100" width="30" height="80" fill="#4A3728"/>
                <rect x="110" y="100" width="30" height="80" fill="#4A3728"/>
                <polygon points="100,50 90,70 110,70" fill="#FFD700"/>
              </svg>
              <span className="image-label">الثكنات ⚔️ {buildings.barracks ? `(${buildings.barracks})` : ''}</span>
            </div>

            {/* Image 7: Warehouse */}
            <div className="village-image">
              <svg viewBox="0 0 200 200" className="village-svg">
                <rect x="0" y="0" width="200" height="200" fill="#DEB887"/>
                <rect x="30" y="70" width="140" height="110" fill="#8B4513"/>
                <polygon points="100,30 20,80 180,80" fill="#A0522D"/>
                <rect x="50" y="100" width="40" height="80" fill="#654321"/>
                <rect x="110" y="100" width="40" height="80" fill="#654321"/>
                <rect x="70" y="130" width="60" height="20" fill="#4A3728"/>
              </svg>
              <span className="image-label">المستودع 📦 {buildings.warehouse ? `(${buildings.warehouse})` : ''}</span>
            </div>

            {/* Image 8: Wall */}
            <div className="village-image">
              <svg viewBox="0 0 200 200" className="village-svg">
                <rect x="0" y="0" width="200" height="200" fill="#87CEEB"/>
                <rect x="0" y="120" width="200" height="80" fill="#228B22"/>
                <rect x="20" y="80" width="30" height="120" fill="#808080"/>
                <rect x="150" y="80" width="30" height="120" fill="#808080"/>
                <rect x="50" y="100" width="100" height="100" fill="#696969"/>
                <rect x="80" y="140" width="40" height="60" fill="#4A3728"/>
                <polygon points="35,60 20,80 50,80" fill="#808080"/>
                <polygon points="165,60 150,80 180,80" fill="#808080"/>
              </svg>
              <span className="image-label">السور 🏰 {buildings.wall ? `(${buildings.wall})` : ''}</span>
            </div>

            {/* Image 9: Marketplace */}
            <div className="village-image">
              <svg viewBox="0 0 200 200" className="village-svg">
                <rect x="0" y="0" width="200" height="200" fill="#F5DEB3"/>
                <rect x="40" y="100" width="120" height="80" fill="#DEB887"/>
                <polygon points="100,40 30,110 170,110" fill="#CD853F"/>
                <rect x="60" y="120" width="20" height="40" fill="#8B4513"/>
                <rect x="90" y="120" width="20" height="40" fill="#FFD700"/>
                <rect x="120" y="120" width="20" height="40" fill="#8B4513"/>
                <circle cx="100" cy="80" r="15" fill="#FF6347"/>
              </svg>
              <span className="image-label">السوق 🏪 {buildings.marketplace ? `(${buildings.marketplace})` : ''}</span>
            </div>

            {/* Image 10: Town Hall */}
            <div className="village-image">
              <svg viewBox="0 0 200 200" className="village-svg">
                <rect x="0" y="0" width="200" height="200" fill="#E6E6FA"/>
                <rect x="50" y="100" width="100" height="80" fill="#F5F5DC"/>
                <polygon points="100,30 40,110 160,110" fill="#FFD700"/>
                <rect x="30" y="100" width="15" height="80" fill="#D4AF37"/>
                <rect x="155" y="100" width="15" height="80" fill="#D4AF37"/>
                <rect x="85" y="130" width="30" height="50" fill="#8B4513"/>
                <circle cx="100" cy="70" r="20" fill="#FFD700"/>
                <text x="100" y="78" textAnchor="middle" fontSize="20" fill="#8B0000">👑</text>
              </svg>
              <span className="image-label">قاعة المدينة 🏛️ {buildings.townHall ? `(${buildings.townHall})` : ''}</span>
            </div>
          </div>
        </div>

        {/* Building Menu */}
        <div className="building-menu">
          <h2>🔨 قائمة البناء</h2>
          <div className="buildings-grid">
            {BUILDINGS.map(building => {
              const currentLevel = buildings[building.id] || 0;
              const multiplier = currentLevel + 1;
              const cost = {
                wood: building.cost.wood * multiplier,
                clay: building.cost.clay * multiplier,
                iron: building.cost.iron * multiplier,
                crop: building.cost.crop * multiplier
              };
              const affordable = canAfford(cost);

              return (
                <div 
                  key={building.id} 
                  className={`building-card ${affordable ? 'affordable' : 'not-affordable'}`}
                  onClick={() => buildBuilding(building)}
                >
                  <div className="building-icon">{BUILDING_IMAGES[building.id]}</div>
                  <div className="building-name">{building.name}</div>
                  <div className="building-level">المستوى: {currentLevel}</div>
                  <div className="building-cost">
                    <span>🪵{cost.wood}</span>
                    <span>🧱{cost.clay}</span>
                    <span>⛏️{cost.iron}</span>
                    <span>🌾{cost.crop}</span>
                  </div>
                  {building.production && Object.keys(building.production).length > 0 && (
                    <div className="building-production">
                      إنتاج: +{Object.values(building.production)[0] * multiplier}/ث
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <footer className="footer">
          <p>⚔️ ترافيان - لعبة استراتيجية ⚔️</p>
        </footer>
      </div>

      <style jsx>{`
        .game-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          color: #fff;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          direction: rtl;
        }

        .header {
          text-align: center;
          padding: 20px;
          background: linear-gradient(90deg, #8B4513, #D2691E, #8B4513);
          border-bottom: 4px solid #FFD700;
        }

        .header h1 {
          margin: 0;
          font-size: 2.5rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }

        .header p {
          margin: 10px 0 0;
          font-size: 1.2rem;
          color: #FFD700;
        }

        .resources-bar {
          display: flex;
          justify-content: center;
          gap: 20px;
          padding: 15px;
          background: rgba(0,0,0,0.5);
          flex-wrap: wrap;
        }

        .resource {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: linear-gradient(145deg, #2d3436, #1e272e);
          padding: 10px 20px;
          border-radius: 10px;
          border: 2px solid #4a5568;
          min-width: 80px;
        }

        .resource.population {
          border-color: #FFD700;
        }

        .resource-icon {
          font-size: 1.5rem;
        }

        .resource-value {
          font-size: 1.3rem;
          font-weight: bold;
          color: #FFD700;
        }

        .resource-name {
          font-size: 0.8rem;
          color: #a0aec0;
        }

        .message {
          text-align: center;
          padding: 15px;
          background: linear-gradient(90deg, #2d3436, #1e272e);
          font-size: 1.2rem;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .village-view {
          padding: 20px;
        }

        .village-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 15px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .village-image {
          background: linear-gradient(145deg, #2d3436, #1e272e);
          border-radius: 15px;
          padding: 10px;
          text-align: center;
          border: 3px solid #4a5568;
          transition: all 0.3s ease;
        }

        .village-image:hover {
          transform: scale(1.05);
          border-color: #FFD700;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
        }

        .village-image.main-village {
          grid-column: span 2;
          border-color: #FFD700;
        }

        .village-svg {
          width: 100%;
          height: 120px;
          border-radius: 10px;
        }

        .image-label {
          display: block;
          margin-top: 10px;
          font-size: 0.9rem;
          color: #FFD700;
        }

        .building-menu {
          padding: 20px;
          background: rgba(0,0,0,0.3);
        }

        .building-menu h2 {
          text-align: center;
          color: #FFD700;
          margin-bottom: 20px;
        }

        .buildings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .building-card {
          background: linear-gradient(145deg, #2d3436, #1e272e);
          border-radius: 15px;
          padding: 15px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid #4a5568;
        }

        .building-card.affordable {
          border-color: #48bb78;
        }

        .building-card.affordable:hover {
          transform: scale(1.05);
          box-shadow: 0 0 15px rgba(72, 187, 120, 0.4);
        }

        .building-card.not-affordable {
          opacity: 0.6;
          border-color: #e53e3e;
        }

        .building-icon {
          font-size: 2.5rem;
          margin-bottom: 10px;
        }

        .building-name {
          font-size: 1rem;
          font-weight: bold;
          color: #fff;
          margin-bottom: 5px;
        }

        .building-level {
          font-size: 0.8rem;
          color: #FFD700;
          margin-bottom: 5px;
        }

        .building-cost {
          display: flex;
          justify-content: center;
          gap: 5px;
          flex-wrap: wrap;
          font-size: 0.7rem;
          color: #a0aec0;
        }

        .building-cost span {
          background: rgba(0,0,0,0.3);
          padding: 2px 5px;
          border-radius: 5px;
        }

        .building-production {
          margin-top: 5px;
          font-size: 0.75rem;
          color: #48bb78;
        }

        .footer {
          text-align: center;
          padding: 20px;
          background: linear-gradient(90deg, #8B4513, #D2691E, #8B4513);
          border-top: 4px solid #FFD700;
        }

        @media (max-width: 600px) {
          .header h1 {
            font-size: 1.8rem;
          }

          .resources-bar {
            gap: 10px;
          }

          .resource {
            padding: 8px 12px;
            min-width: 60px;
          }

          .village-image.main-village {
            grid-column: span 1;
          }
        }
      `}</style>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          overflow-x: hidden;
        }
      `}</style>
    </>
  );
}
