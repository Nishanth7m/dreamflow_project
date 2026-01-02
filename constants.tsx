
import React from 'react';
import { InventoryItem, ShipmentStatus, AgentStatus } from './types';

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: '1', name: 'Premium Coffee Beans', category: 'Raw Materials', stock: 45, minThreshold: 50, price: 12.99 },
  { id: '2', name: 'Paper Cups (12oz)', category: 'Packaging', stock: 1200, minThreshold: 500, price: 0.08 },
  { id: '3', name: 'Organic Soy Milk', category: 'Dairy/Alt', stock: 12, minThreshold: 20, price: 3.50 },
  { id: '4', name: 'Eco-Friendly Stirrers', category: 'Packaging', stock: 300, minThreshold: 100, price: 0.02 },
  { id: '5', name: 'Cold Brew Filter Bags', category: 'Equipment', stock: 8, minThreshold: 10, price: 15.00 },
];

export const INITIAL_SHIPMENTS: ShipmentStatus[] = [
  { id: 'OPS-9921', destination: 'Warehouse A', status: 'shipped', timestamp: '2023-10-24 14:30', location: 'Transit Hub 4' },
  { id: 'OPS-9922', destination: 'Main Store', status: 'out-for-delivery', timestamp: '2023-10-24 09:15', location: 'Local Distribution' },
  { id: 'OPS-9923', destination: 'Warehouse B', status: 'processing', timestamp: '2023-10-24 16:45', location: 'Central Packing' },
];

export const AGENTS: AgentStatus[] = [
  { name: 'Inventory AI', status: 'active', icon: '📦' },
  { name: 'Marketing AI', status: 'busy', icon: '📣' },
  { name: 'Logistics AI', status: 'active', icon: '🚚' },
];
