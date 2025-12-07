
export type AnnouncementStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'ASSIGNED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Announcement {
  id: string;
  title: string;
  type: string;
  origin: string;
  destination: string;
  createdAt: string; 
  dueDate: string;  
  budget: number;
  status: AnnouncementStatus;
}

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ANN-001',
    title: 'Colis Paris → Lyon',
    type: 'Petite livraison',
    origin: 'Paris 75001',
    destination: 'Lyon 69001',
    createdAt: '2025-12-01',
    dueDate: '2025-12-15',
    budget: 25,
    status: 'PUBLISHED',
  },
  {
    id: 'ANN-002',
    title: 'Documents Marseille → Toulouse',
    type: 'Document',
    origin: 'Marseille 13001',
    destination: 'Toulouse 31000',
    createdAt: '2025-11-28',
    dueDate: '2025-12-10',
    budget: 15,
    status: 'ASSIGNED',
  },
  {
    id: 'ANN-003',
    title: 'Palette Lille → Nantes',
    type: 'Grande livraison',
    origin: 'Lille 59000',
    destination: 'Nantes 44000',
    createdAt: '2025-12-05',
    dueDate: '2025-12-20',
    budget: 85,
    status: 'DRAFT',
  },
  {
    id: 'ANN-004',
    title: 'Électroménager Strasbourg → Nice',
    type: 'Grande livraison',
    origin: 'Strasbourg 67000',
    destination: 'Nice 06000',
    createdAt: '2025-11-25',
    dueDate: '2025-12-05',
    budget: 120,
    status: 'COMPLETED',
  },
  {
    id: 'ANN-005',
    title: 'Colis Bordeaux → Rennes',
    type: 'Petite livraison',
    origin: 'Bordeaux 33000',
    destination: 'Rennes 35000',
    createdAt: '2025-12-02',
    dueDate: '2025-12-08',
    budget: 30,
    status: 'CANCELLED',
  },
];

export const fetchClientAnnouncements = async (): Promise<Announcement[]> => {
  
  return Promise.resolve(MOCK_ANNOUNCEMENTS);
};
