import React from 'react';
import './SunWithRays.css';

function SunWithRays() {
    return (
        <div className="sun-container">
            <svg className="sun-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                {/* Rayons du soleil */}
                {[...Array(12)].map((_, i) => {
                    const angle = (i * 30);
                    const rad = (angle * Math.PI) / 180;
                    const x1 = 100 + 50 * Math.cos(rad);
                    const y1 = 100 + 50 * Math.sin(rad);
                    const x2 = 100 + 85 * Math.cos(rad);
                    const y2 = 100 + 85 * Math.sin(rad);

                    return (
                        <line
                            key={i}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            className="sun-ray"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        />
                    );
                })}

                {/* Cercle central du soleil */}
                <circle cx="100" cy="100" r="40" className="sun-circle" />

                {/* Lueur intérieure */}
                <circle cx="100" cy="100" r="35" className="sun-glow" />
            </svg>
        </div>
    );
}

export default SunWithRays;