import React from 'react';
import { Upload, BookOpen, TrendingUp, Users, Trophy } from 'lucide-react';

interface DockMenuProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    userType: string;
}

export function DockMenu({ activeTab, onTabChange, userType }: DockMenuProps) {
    const items = [
        { id: 'plays', label: 'Jogadas', icon: Upload, hue: 210 },
        { id: 'tips', label: 'Dicas', icon: BookOpen, hue: 30 },
        { id: 'team-stats', label: 'Equipas', icon: TrendingUp, hue: 140 },
        { id: 'athlete-stats', label: 'Atletas', icon: Users, hue: 290 },
    ];

    if (userType === 'treinador') {
        items.push({ id: 'team', label: 'Equipa', icon: Users, hue: 200 });
        items.push({ id: 'games', label: 'Jogos', icon: Trophy, hue: 45 });
        items.push({ id: 'pending', label: 'Pendentes', icon: Users, hue: 10 });
    }

    return (
        <div className="dock-container">
            <nav className="blocks">
                {items.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={`block ${activeTab === item.id ? 'active' : ''}`}
                        style={{ '--hue': item.hue } as React.CSSProperties}
                    >
                        <div className="block__item">
                            <item.icon />
                        </div>
                        <span className="block__label">{item.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
}
