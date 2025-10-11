import type { ReferenceApiService } from '@/types/reference-system';
import type { Classroom } from '@/types/reference';

/**
 * Сервис для работы с API кабинетов
 * Следует принципу Single Responsibility - отвечает только за API операции с кабинетами
 * Следует принципу Dependency Inversion - зависит от абстракции ReferenceApiService
 */
export class ClassroomService implements ReferenceApiService<Classroom> {
	private baseUrl = '/api/classrooms';

	async getAll(_params?: any): Promise<{ data: Classroom[]; pagination?: any }> {
		const response = await fetch(this.baseUrl);
		if (!response.ok) {
			throw new Error(`Failed to fetch classrooms: ${response.statusText}`);
		}
		const data = await response.json();
		return { data };
	}

	async getById(id: number): Promise<Classroom> {
		const response = await fetch(`${this.baseUrl}/${id}`);
		if (!response.ok) {
			throw new Error(`Failed to fetch classroom: ${response.statusText}`);
		}
		return response.json();
	}

	async create(data: Omit<Classroom, 'id'>): Promise<Classroom> {
		const response = await fetch(this.baseUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			throw new Error(`Failed to create classroom: ${response.statusText}`);
		}
		return response.json();
	}

	async update(id: number, data: Partial<Classroom>): Promise<Classroom> {
		const response = await fetch(`${this.baseUrl}/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			throw new Error(`Failed to update classroom: ${response.statusText}`);
		}
		return response.json();
	}

	async delete(id: number): Promise<void> {
		const response = await fetch(`${this.baseUrl}/${id}`, {
			method: 'DELETE',
		});
		if (!response.ok) {
			throw new Error(`Failed to delete classroom: ${response.statusText}`);
		}
	}
}
