
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  minThreshold: number;
  price: number;
}

export interface ShipmentStatus {
  id: string;
  destination: string;
  status: 'processing' | 'shipped' | 'out-for-delivery' | 'delivered';
  timestamp: string;
  location: string;
}

export interface ActionLogEntry {
  id: string;
  type: 'inventory' | 'invoice' | 'marketing' | 'logistics';
  message: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface MarketingContent {
  instagram: string;
  email: string;
  twitter: string;
}

export type ViewType = 'dashboard' | 'inventory' | 'invoice' | 'marketing' | 'logistics';

export interface AgentStatus {
  name: string;
  status: 'active' | 'idle' | 'busy';
  icon: string;
}
