import type { ReferenceApiService } from '@/types/reference-system';
import type { Teacher } from '@/types/reference';

/**
 * Сервис для работы с API учителей
 * Следует принципу Single Responsibility - отвечает только за API операции с учителями
 * Следует принципу Dependency Inversion - зависит от абстракции ReferenceApiService
 */
export class TeacherService implements ReferenceApiService<Teacher> {
	private baseUrl = '/api/teachers';

	async getAll(_params?: any): Promise<{ data: Teacher[]; pagination?: any }> {
		const response = await fetch(this.baseUrl);
		if (!response.ok) {
			throw new Error(`Failed to fetch teachers: ${response.statusText}`);
		}
		const data = await response.json();
		return { data };
	}

	async getById(id: number): Promise<Teacher> {
		const response = await fetch(`${this.baseUrl}/${id}`);
		if (!response.ok) {
			throw new Error(`Failed to fetch teacher: ${response.statusText}`);
		}
		return response.json();
	}

	async create(data: Omit<Teacher, 'id'>): Promise<Teacher> {
		const response = await fetch(this.baseUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			throw new Error(`Failed to create teacher: ${response.statusText}`);
		}
		return response.json();
	}

	async update(id: number, data: Partial<Teacher>): Promise<Teacher> {
		const response = await fetch(`${this.baseUrl}/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			throw new Error(`Failed to update teacher: ${response.statusText}`);
		}
		return response.json();
	}

	async delete(id: number): Promise<void> {
		const response = await fetch(`${this.baseUrl}/${id}`, {
			method: 'DELETE',
		});
		if (!response.ok) {
			throw new Error(`Failed to delete teacher: ${response.statusText}`);
		}
	}
}
