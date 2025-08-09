import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, Room } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-rooms.component.html',
  styleUrls: ['./admin-rooms.component.css']
})
export class AdminRoomsComponent implements OnInit {
  rooms: Room[] = [];
  filteredRooms: Room[] = [];
  loading = true;
  showModal = false;
  editMode = false;
  searchTerm = '';
  selectedFiles: File[] = [];

  currentRoom: Room = {
    roomNumber: '',
    type: 'standard',
    title: '',
    description: '',
    price: 0,
    capacityAdults: 1,
    capacityChildren: 0,
    bedType: 'double',
    size: 0,
    amenities: [],
    images: [],
    isAvailable: true,
    floor: 1,
    smokingAllowed: false,
    petFriendly: false
  };

  roomTypes = ['standard', 'deluxe', 'suite', 'presidential'];
  bedTypes = ['single', 'double', 'queen', 'king', 'twin'];
  availableAmenities = [
    'wifi', 'tv', 'minibar', 'safe', 'balcony', 'sea-view', 
    'air-conditioning', 'room-service', 'jacuzzi', 'kitchenette'
  ];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadRooms();
  }

  loadRooms() {
    this.loading = true;
    this.adminService.getRooms().subscribe({
      next: (response) => {
        const raw = response?.data || [];
        this.rooms = raw.map((r: any) => {
          // Normalize arrays possibly stored as JSON strings
          const normAmenities = Array.isArray(r?.amenities)
            ? r.amenities
            : (r?.amenities ? safeParseArray(r.amenities) : []);
          const normImages = Array.isArray(r?.images)
            ? r.images
            : (r?.images ? safeParseArray(r.images) : []);

          return {
            id: r.id,
            roomNumber: String(r.roomNumber ?? ''),
            type: String(r.type ?? 'standard'),
            title: String(r.title ?? ''),
            description: String(r.description ?? ''),
            price: Number(r.price ?? 0),
            capacityAdults: Number(r.capacityAdults ?? 1),
            capacityChildren: Number(r.capacityChildren ?? 0),
            bedType: String(r.bedType ?? 'double'),
            size: Number(r.size ?? 0),
            amenities: normAmenities,
            images: normImages,
            isAvailable: Boolean(r.isAvailable ?? true),
            floor: Number(r.floor ?? 1),
            smokingAllowed: Boolean(r.smokingAllowed ?? false),
            petFriendly: Boolean(r.petFriendly ?? false)
          } as Room;
        });
        this.filteredRooms = [...this.rooms];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading rooms:', error);
        this.loading = false;
      }
    });
  }

  filterRooms() {
    if (!this.searchTerm) {
      this.filteredRooms = [...this.rooms];
    } else {
      this.filteredRooms = this.rooms.filter(room =>
        room.roomNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        room.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        room.type.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  openModal(room?: Room) {
    this.showModal = true;
    if (room) {
      this.editMode = true;
      this.currentRoom = { 
        ...room,
        amenities: room.amenities ?? [],
        images: room.images ?? []
      };
      this.selectedFiles = [];
    } else {
      this.editMode = false;
      this.currentRoom = {
        roomNumber: '',
        type: 'standard',
        title: '',
        description: '',
        price: 0,
        capacityAdults: 1,
        capacityChildren: 0,
        bedType: 'double',
        size: 0,
        amenities: [],
        images: [],
        isAvailable: true,
        floor: 1,
        smokingAllowed: false,
        petFriendly: false
      };
      this.selectedFiles = [];
    }
  }

  closeModal() {
    this.showModal = false;
    this.editMode = false;
  }

  saveRoom() {
    if (this.editMode && this.currentRoom.id) {
      this.adminService.updateRoom(this.currentRoom.id, this.currentRoom, this.selectedFiles).subscribe({
        next: () => {
          this.loadRooms();
          this.closeModal();
        },
        error: (error) => console.error('Error updating room:', error)
      });
    } else {
      this.adminService.createRoom(this.currentRoom, this.selectedFiles).subscribe({
        next: () => {
          this.loadRooms();
          this.closeModal();
        },
        error: (error) => console.error('Error creating room:', error)
      });
    }
  }

  deleteRoom(room: Room) {
    if (confirm(`Are you sure you want to delete room ${room.roomNumber}?`)) {
      this.adminService.deleteRoom(room.id!).subscribe({
        next: () => {
          this.loadRooms();
        },
        error: (error) => console.error('Error deleting room:', error)
      });
    }
  }

  toggleAmenity(amenity: string) {
    const index = this.currentRoom.amenities.indexOf(amenity);
    if (index > -1) {
      this.currentRoom.amenities.splice(index, 1);
    } else {
      this.currentRoom.amenities.push(amenity);
    }
  }

  isAmenitySelected(amenity: string): boolean {
    return this.currentRoom.amenities.includes(amenity);
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFiles = Array.from(input.files);
    }
  }
}

// Safely parse a JSON array; return [] on failure
function safeParseArray(value: any): any[] {
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
