import React from 'react';
import type { Client } from '../types';

interface ClientCardProps {
    client: Client;
    onDelete?: (id: string | undefined) => void;
}

function getCardColor(address: string) {
    if (address.startsWith('В. Манџуковски')) return 'client-card-vm';
    if (address.startsWith('Петар Ацев')) return 'client-card-pa';
    if (address.startsWith('Анастас Митрев')) return 'client-card-am';
    if (address.startsWith('Симеон Кавракиров')) return 'client-card-sk';
    if (address.startsWith('К. Ј. Питу')) return 'client-card-kjp';
    if (address.startsWith('Јане Сандански')) return 'client-card-js';
    if (address.startsWith('АВНОЈ')) return 'client-card-avnoj';
    return '';
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onDelete }) => {
    const cardClass = `client-card ${getCardColor(client.address)}`;
    return (
        <div className={cardClass}>
            <div className="client-info">
                <div className="client-name">{client.fullName}</div>
                <div className="client-address">{client.address}</div>
                <div className="client-phone">{client.phone}</div>
            </div>
            <div className="client-actions">
                <a className="call-btn" href={`tel:${client.phone}`}>
                    Јави се
                </a>
                {onDelete && (
                    <button className="delete-btn" onClick={() => onDelete(client._id)}>
                        Избриши
                    </button>
                )}
            </div>
        </div>
    );
};

export default ClientCard;
